from typing import Any, List
from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends
from app.core.database import get_supabase
from app.schemas.all import SocialProfileCreate, SocialProfileResponse

router = APIRouter()

@router.get("/{contact_id}/social", response_model=List[SocialProfileResponse])
def read_social_profiles(
    contact_id: UUID,
    supabase = Depends(get_supabase)
) -> Any:
    """
    Retrieve social profiles for a contact.
    """
    response = supabase.table("social_profiles").select("*").eq("contact_id", str(contact_id)).execute()
    return response.data

@router.post("/{contact_id}/social", response_model=SocialProfileResponse)
def create_social_profile(
    contact_id: UUID,
    profile_in: SocialProfileCreate,
    supabase = Depends(get_supabase)
) -> Any:
    """
    Link a social profile (simulated).
    """
    data = profile_in.model_dump()
    data["contact_id"] = str(contact_id)
    
    response = supabase.table("social_profiles").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Could not create profile")
    return response.data[0]

@router.patch("/{contact_id}/social/{profile_id}", response_model=SocialProfileResponse)
def update_social_profile(
    contact_id: UUID,
    profile_id: UUID,
    profile_update: Any,  # Using Any to be flexible, but ideally schema
    supabase = Depends(get_supabase)
) -> Any:
    """
    Update a social profile (e.g., status).
    """
    # If using Pydantic, convert. For now, assuming raw dict or similar
    if hasattr(profile_update, 'model_dump'):
        data = profile_update.model_dump(exclude_unset=True)
    else:
        data = profile_update

    response = supabase.table("social_profiles").update(data).eq("id", str(profile_id)).execute()
    if not response.data:
         raise HTTPException(status_code=404, detail="Profile not found or update failed")
    return response.data[0]

@router.delete("/{contact_id}/social/{profile_id}")
def delete_social_profile(
    contact_id: UUID, 
    profile_id: UUID,
    supabase = Depends(get_supabase)
) -> Any:
    """
    Delete a social profile.
    """
    # Using count='exact' to confirm deletion
    response = supabase.table("social_profiles").delete().eq("id", str(profile_id)).execute()
    # Supabase-py delete returns data of deleted rows
    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found or delete failed")
    return {"message": "Profile deleted successfully"}

@router.get("/{contact_id}/social/events", response_model=List[Any]) # Use Any or SocialEventResponse
def read_social_events(
    contact_id: UUID,
    supabase = Depends(get_supabase)
) -> Any:
    """
    Retrieve social activity feed for a contact.
    """
    response = supabase.table("social_events").select("*").eq("contact_id", str(contact_id)).order("event_time", desc=True).execute()
    return response.data
