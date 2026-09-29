import pytest
from fastapi.testclient import TestClient
from server.main import app
from server.utils.config import config

client = TestClient(app)

def test_meta_webhook_verification_handshake():
    # Valid handshake
    res = client.get(
        "/api/whatsapp/webhook",
        params={
            "hub.mode": "subscribe",
            "hub.verify_token": config.WHATSAPP_VERIFY_TOKEN,
            "hub.challenge": "11582014"
        }
    )
    assert res.status_code == 200
    assert res.text == "11582014"

    # Invalid token handshake
    res_bad = client.get(
        "/api/whatsapp/webhook",
        params={
            "hub.mode": "subscribe",
            "hub.verify_token": "wrong_token_123",
            "hub.challenge": "11582014"
        }
    )
    assert res_bad.status_code == 403

def test_unauthorized_user_prompt():
    unauth_phone = "917711223344"
    # Ensure this phone starts clean/unauthorized
    res = client.post(
        "/api/whatsapp/simulate-incoming",
        json={"phone": unauth_phone, "message": "Hello", "type": "text"}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "unauthorized_prompt"
    assert "JOIN SHP-W12-H1042" in data["reply"]

def test_qr_code_authorization():
    auth_phone = "919988776655"
    res = client.post(
        "/api/whatsapp/simulate-incoming",
        json={"phone": auth_phone, "message": "JOIN SHP-W14-H2045", "type": "text"}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "authorized"
    assert "Ward 14" in data["reply"]
    assert "SHP-W14-H2045" in data["reply"]

def test_authorized_dashboard_navigation():
    test_phone = "919988776655"

    # 1. Track complaints
    res_track = client.post(
        "/api/whatsapp/simulate-incoming",
        json={"phone": test_phone, "message": "2", "type": "text"}
    )
    assert res_track.status_code == 200
    assert res_track.json()["status"] == "track_complaints"

    # 2. Eco Wallet
    res_wallet = client.post(
        "/api/whatsapp/simulate-incoming",
        json={"phone": test_phone, "message": "3", "type": "text"}
    )
    assert res_wallet.status_code == 200
    assert res_wallet.json()["status"] == "wallet_info"
    assert "EcoCoin" in res_wallet.json()["reply"]

    # 3. Live Truck Tracking
    res_truck = client.post(
        "/api/whatsapp/simulate-incoming",
        json={"phone": test_phone, "message": "4", "type": "text"}
    )
    assert res_truck.status_code == 200
    assert res_truck.json()["status"] == "truck_tracking"
    assert "MH-18-BZ-4412" in res_truck.json()["reply"]

def test_photo_and_location_complaint_flow():
    test_phone = "919988776655"

    # Step 1: Send Photo
    res_photo = client.post(
        "/api/whatsapp/simulate-incoming",
        json={
            "phone": test_phone,
            "message": "",
            "type": "image",
            "media_url": "https://example.com/overflow_bin.jpg"
        }
    )
    assert res_photo.status_code == 200
    assert res_photo.json()["status"] == "awaiting_location"

    # Step 2: Send WhatsApp GPS Location Pin
    res_loc = client.post(
        "/api/whatsapp/simulate-incoming",
        json={
            "phone": test_phone,
            "message": "",
            "type": "location",
            "latitude": 21.3487,
            "longitude": 74.8812
        }
    )
    assert res_loc.status_code == 200
    data = res_loc.json()
    assert data["status"] == "complaint_created"
    assert "SHP-2026-W14" in data["ticket"]
    assert "+20" in data["reply"]

def test_generate_household_qr():
    res = client.post(
        "/api/whatsapp/generate-qr",
        json={"ward": 14, "household_number": 2045}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["household_code"] == "SHP-W14-H2045"
    assert "JOIN SHP-W14-H2045" in data["qr_scan_text"]
    assert "wa.me" in data["whatsapp_direct_link"]

def test_list_whatsapp_citizens():
    res = client.get("/api/whatsapp/citizens")
    assert res.status_code == 200
    citizens = res.json()
    assert any(c["household_id"] == "SHP-W14-H2045" for c in citizens)
