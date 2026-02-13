import asyncio
import os
import sys
from datetime import datetime, timedelta
import random

# Add the parent directory to sys.path to allow importing app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import db
from app.core.config import settings

# Mock Data
MOCK_CONTACT = {
    "first_name": "Rajesh",
    "last_name": "Sharma",
    "email": "rajesh.sharma@example.com",
    "phone": "+919876543210",
    "job_title": "CTO",
    "company": "Tata Steel"
}

MOCK_PROFILES = [
    {
        "platform": "linkedin",
        "platform_user_id": "rajesh-sharma-cto",
        "handle": "rajesh-sharma-cto",
        "profile_url": "https://linkedin.com/in/rajesh-sharma-cto",
        "display_name": "Rajesh Sharma",
        "bio": "CTO at Tata Steel | Digital Transformation Leader",
        "followers": 5000,
        "is_verified": True
    },
    {
        "platform": "twitter",
        "platform_user_id": "rajesh_cto",
        "handle": "@rajesh_cto",
        "profile_url": "https://twitter.com/rajesh_cto",
        "display_name": "Rajesh Sharma",
        "bio": "Tech enthusiast | Speaker",
        "followers": 1200,
        "is_verified": False
    }
]

MOCK_EVENTS = [
    {
        "platform": "linkedin",
        "event_type": "new_post",
        "title": "New LinkedIn Post",
        "content": "Excited to announce our new sustainability initiative at Tata Steel. #GreenSteel",
        "event_url": "https://linkedin.com/posts/rajesh-sharma-cto_123",
        "is_read": False
    },
    {
        "platform": "twitter",
        "event_type": "mention",
        "title": "Mentioned in Tweet",
        "content": "@rajesh_cto Great insights on Industry 4.0 today!",
        "event_url": "https://twitter.com/user/status/123",
        "is_read": True
    },
    {
        "platform": "linkedin",
        "event_type": "job_change",
        "title": "Job Update",
        "content": "Promoted to Group CTO",
        "event_url": "https://linkedin.com/in/rajesh-sharma-cto",
        "is_read": False
    }
]

async def seed_data():
    print("🌱 Starting data seed...")
    
    # Initialize Supabase
    db.connect()
    supabase = db.get_client()
    
    # 1. Check or Create Contact
    print("Checking for existing contact...")
    res = supabase.table("contacts").select("*").eq("email", MOCK_CONTACT["email"]).execute()
    
    if res.data:
        contact_id = res.data[0]["id"]
        print(f"Found existing contact: {contact_id}")
    else:
        print("Creating new contact...")
        # Note: Adjust 'contacts' table schema if needed. Assuming basic fields.
        # If 'contacts' table doesn't exist or has different schema, this might fail.
        # But usually there is a contacts table in a CRM.
        try:
            res = supabase.table("contacts").insert(MOCK_CONTACT).execute()
            contact_id = res.data[0]["id"]
            print(f"Created contact: {contact_id}")
        except Exception as e:
            print(f"Error creating contact: {e}")
            return

    # 2. Create Social Profiles
    print(f"Seeding social profiles for contact {contact_id}...")
    
    # Clear existing profiles for clean slate (optional)
    supabase.table("social_profiles").delete().eq("contact_id", contact_id).execute()

    created_profiles = []
    for profile in MOCK_PROFILES:
        data = {
            **profile,
            "contact_id": contact_id,
            "status": "active",
            "is_connected": True,
            "last_synced_at": datetime.now().isoformat()
        }
        res = supabase.table("social_profiles").insert(data).execute()
        created_profiles.append(res.data[0])
        print(f"Created verified {profile['platform']} profile")

    # 3. Create Social Events
    print(f"Seeding social events for contact {contact_id}...")
    
    # Clear existing events
    supabase.table("social_events").delete().eq("contact_id", contact_id).execute()
    
    for i, event in enumerate(MOCK_EVENTS):
        # Link to corresponding profile if possible
        profile = next((p for p in created_profiles if p["platform"] == event["platform"]), None)
        social_account_id = profile["id"] if profile else None
        
        data = {
            **event,
            "contact_id": contact_id,
            "social_account_id": social_account_id,
            "event_time": (datetime.now() - timedelta(hours=i*5)).isoformat(), # Staggered times
            "created_at": datetime.now().isoformat()
        }
        
        supabase.table("social_events").insert(data).execute()
        print(f"Created {event['event_type']} event on {event['platform']}")

    print("✅ Seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed_data())
