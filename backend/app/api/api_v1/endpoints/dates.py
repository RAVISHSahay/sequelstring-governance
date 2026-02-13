from typing import Any, List
from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends
from app.core.database import get_supabase
from app.schemas.all import ImportantDateCreate, ImportantDateUpdate, ImportantDateResponse

router = APIRouter()

@router.get("/{contact_id}/dates", response_model=List[ImportantDateResponse])
def read_important_dates(
    contact_id: UUID,
    supabase = Depends(get_supabase)
) -> Any:
    """
    Retrieve important dates for a contact.
    """
    response = supabase.table("important_dates").select("*").eq("contact_id", str(contact_id)).execute()
    return response.data

@router.post("/{contact_id}/dates", response_model=ImportantDateResponse)
def create_important_date(
    contact_id: UUID,
    date_in: ImportantDateCreate,
    supabase = Depends(get_supabase)
) -> Any:
    """
    Create new important date.
    """
    data = date_in.model_dump()
    data["contact_id"] = str(contact_id)
    # Convert time to string for JSON serialization if needed, Supabase handles it usually
    data["send_time"] = str(data["send_time"])
    
    response = supabase.table("important_dates").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Could not create date")
    return response.data[0]

@router.put("/{contact_id}/dates/{date_id}", response_model=ImportantDateResponse)
def update_important_date(
    contact_id: UUID,
    date_id: UUID,
    date_in: ImportantDateUpdate,
    supabase = Depends(get_supabase)
) -> Any:
    """
    Update an important date.
    """
    data = date_in.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="No data to update")
        
    if "send_time" in data:
        data["send_time"] = str(data["send_time"])

    response = supabase.table("important_dates").update(data).eq("id", str(date_id)).eq("contact_id", str(contact_id)).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Date not found")
    return response.data[0]

@router.delete("/{contact_id}/dates/{date_id}")
def delete_important_date(
    contact_id: UUID,
    date_id: UUID,
    supabase = Depends(get_supabase)
) -> Any:
    """
    Delete an important date.
    """
    response = supabase.table("important_dates").delete().eq("id", str(date_id)).eq("contact_id", str(contact_id)).execute()
    return {"success": True, "message": "Date deleted"}
