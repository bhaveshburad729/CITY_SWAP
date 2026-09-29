from fastapi import APIRouter, Request, Response, Depends, Query, HTTPException, status
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
import logging

from server.database.db import get_db
from server.utils.config import config
from server.services.whatsapp_service import WhatsAppService
from server.models.whatsapp_session import WhatsAppCitizen

logger = logging.getLogger(__name__)

router = APIRouter()

# ---------------------------------------------------------
# 1. Meta WhatsApp Cloud API Webhook Handshake (GET)
# ---------------------------------------------------------
@router.get("/webhook", response_class=PlainTextResponse)
def verify_webhook(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
    hub_challenge: str = Query(None, alias="hub.challenge")
):
    """
    Webhook verification handshake for Meta WhatsApp Business Cloud API.
    """
    if hub_mode == "subscribe" and hub_verify_token == config.WHATSAPP_VERIFY_TOKEN:
        logger.info("[META WHATSAPP] Webhook verified successfully!")
        return str(hub_challenge)
    
    logger.warning(f"[META WHATSAPP] Webhook verification failed. Token mismatch.")
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Verification token mismatch")


# ---------------------------------------------------------
# 2. Meta WhatsApp Cloud API Message Receiver (POST)
# ---------------------------------------------------------
@router.post("/webhook")
async def receive_meta_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Receives incoming WhatsApp messages from Meta Graph API.
    """
    try:
        body = await request.json()
    except Exception:
        return {"status": "ignored", "reason": "invalid_json"}

    # Validate Meta event structure
    if "entry" not in body or not body["entry"]:
        return {"status": "ignored", "reason": "no_entry"}

    for entry in body["entry"]:
        for change in entry.get("changes", []):
            value = change.get("value", {})
            messages = value.get("messages", [])
            for msg in messages:
                sender_phone = msg.get("from", "")
                msg_type = msg.get("type", "text")
                text_content = ""
                media_url = ""
                latitude = None
                longitude = None

                if msg_type == "text":
                    text_content = msg.get("text", {}).get("body", "")
                elif msg_type == "interactive":
                    interactive = msg.get("interactive", {})
                    if "button_reply" in interactive:
                        text_content = interactive["button_reply"].get("id", "")
                    elif "list_reply" in interactive:
                        text_content = interactive["list_reply"].get("id", "")
                elif msg_type == "image":
                    image_id = msg.get("image", {}).get("id", "")
                    media_url = f"https://graph.facebook.com/v20.0/{image_id}"
                elif msg_type == "location":
                    loc = msg.get("location", {})
                    latitude = loc.get("latitude")
                    longitude = loc.get("longitude")

                WhatsAppService.handle_incoming_message(
                    db=db,
                    sender_phone=sender_phone,
                    message_type=msg_type,
                    text_body=text_content,
                    media_url=media_url,
                    latitude=latitude,
                    longitude=longitude
                )

    return {"status": "processed"}


# ---------------------------------------------------------
# 3. Twilio WhatsApp Webhook Receiver (POST)
# ---------------------------------------------------------
@router.post("/twilio-webhook")
async def receive_twilio_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Receives incoming WhatsApp messages from Twilio Sandbox / Number.
    Returns standard TwiML XML response.
    """
    form_data = await request.form()
    from_raw = form_data.get("From", "") # e.g. "whatsapp:+919876543210"
    body_text = form_data.get("Body", "")
    media_url = form_data.get("MediaUrl0", "")
    latitude = form_data.get("Latitude")
    longitude = form_data.get("Longitude")

    sender_phone = from_raw.replace("whatsapp:", "").replace("+", "").strip()
    msg_type = "image" if media_url else ("location" if latitude else "text")

    res = WhatsAppService.handle_incoming_message(
        db=db,
        sender_phone=sender_phone,
        message_type=msg_type,
        text_body=body_text,
        media_url=media_url,
        latitude=float(latitude) if latitude else None,
        longitude=float(longitude) if longitude else None
    )

    reply_text = res.get("reply", "OK")
    xml_response = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>{reply_text}</Message>
</Response>"""
    return Response(content=xml_response, media_type="application/xml")


# ---------------------------------------------------------
# 4. Generate Household QR Code & Direct Link (POST)
# ---------------------------------------------------------
@router.post("/generate-qr")
def generate_household_qr(payload: dict):
    """
    Generates household QR payload and direct WhatsApp launch link.
    Example payload: {"ward": 12, "household_number": 1042}
    """
    ward = payload.get("ward", 12)
    house_num = payload.get("household_number", 1001)
    code = f"SHP-W{ward}-H{house_num}"
    bot_phone = config.WHATSAPP_BUSINESS_PHONE.replace("+", "").replace(" ", "")
    link = f"https://wa.me/{bot_phone}?text=JOIN%20{code}"

    return {
        "household_code": code,
        "ward": f"Ward {ward}",
        "household_number": house_num,
        "qr_scan_text": f"JOIN {code}",
        "whatsapp_direct_link": link,
        "instructions": "Print this QR code on municipal bin sticker or property tax bill."
    }


# ---------------------------------------------------------
# 5. List Authorized WhatsApp Citizens (GET)
# ---------------------------------------------------------
@router.get("/citizens")
def list_whatsapp_citizens(db: Session = Depends(get_db)):
    """
    List registered WhatsApp citizen households in Shirpur.
    """
    citizens = db.query(WhatsAppCitizen).order_by(WhatsAppCitizen.id.desc()).all()
    return [
        {
            "id": c.id,
            "phone_number": c.phone_number,
            "full_name": c.full_name,
            "ward": c.ward,
            "household_id": c.household_id,
            "is_authorized": c.is_authorized,
            "eco_coins": c.eco_coins,
            "preferred_language": c.preferred_language,
            "conversation_state": c.conversation_state,
            "created_at": c.created_at.isoformat() if c.created_at else None
        }
        for c in citizens
    ]


# ---------------------------------------------------------
# 6. Simulator / Developer Test Endpoint (POST)
# ---------------------------------------------------------
@router.post("/simulate-incoming")
def simulate_whatsapp_incoming(payload: dict, db: Session = Depends(get_db)):
    """
    Simulate a WhatsApp message without needing a live Meta account.
    Example:
    {"phone": "919876543210", "message": "JOIN SHP-W12-H1042", "type": "text"}
    """
    phone = payload.get("phone", "919876543210")
    message = payload.get("message", "1")
    msg_type = payload.get("type", "text")
    media_url = payload.get("media_url", "")
    lat = payload.get("latitude")
    lng = payload.get("longitude")

    res = WhatsAppService.handle_incoming_message(
        db=db,
        sender_phone=phone,
        message_type=msg_type,
        text_body=message,
        media_url=media_url,
        latitude=lat,
        longitude=lng
    )
    return res
