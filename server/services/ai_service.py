import random

class AIService:
    @staticmethod
    def verify_waste_image(image_url: str = None, waste_type: str = "Mixed Waste"):
        """
        Simulates AI waste classification using computer vision / AI model.
        In production, calls Vision API to inspect image for garbage content & score confidence.
        """
        confidence = round(random.uniform(0.88, 0.99), 2)
        verified_type = waste_type if waste_type else "Mixed Waste"
        return {
            "status": "Verified",
            "confidence": confidence,
            "detected_type": verified_type
        }
