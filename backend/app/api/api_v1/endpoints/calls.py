from typing import Any, List, Optional
from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends
from app.core.database import get_supabase
from app.schemas.all import CallCreate, CallResponse

router = APIRouter()

@router.get("/", response_model=List[CallResponse])
def read_calls(
    contact_id: Optional[UUID] = None,
    user_id: Optional[UUID] = None,
    supabase = Depends(get_supabase)
) -> Any:
    """
    Retrieve all calls (with filtering).
    """
    query = supabase.table("calls").select("*").order("created_at", desc=True).limit(50)
    
    if contact_id:
        query = query.eq("contact_id", str(contact_id))
    if user_id:
        query = query.eq("user_id", str(user_id))
        
    response = query.execute()
    return response.data

@router.post("/", response_model=CallResponse)
def create_call(
    call_in: CallCreate,
    supabase = Depends(get_supabase)
) -> Any:
    """
    Log a new call.
    """
    data = call_in.model_dump()
    data["contact_id"] = str(data["contact_id"])
    data["user_id"] = str(data["user_id"])
    
    if data.get("scheduled_at"):
        data["scheduled_at"] = str(data["scheduled_at"])
    if data.get("started_at"):
        data["started_at"] = str(data["started_at"])

    response = supabase.table("calls").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Could not create call")
    return response.data[0]
