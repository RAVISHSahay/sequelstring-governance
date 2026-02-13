from typing import Any, List
from uuid import UUID
from fastapi import APIRouter, Depends
from app.core.database import get_supabase
from app.schemas.all import NewsAlertResponse

router = APIRouter()

@router.get("/news/{account_id}", response_model=List[NewsAlertResponse])
def read_account_news(
    account_id: UUID,
    supabase = Depends(get_supabase)
) -> Any:
    """
    Retrieve news alerts for an account.
    """
    response = supabase.table("news_alerts").select("*").eq("account_id", str(account_id)).execute()
    return response.data

@router.get("/feed", response_model=List[NewsAlertResponse])
def read_feed(
    supabase = Depends(get_supabase)
) -> Any:
    """
    Retrieve global intelligence feed.
    """
    # Simply get latest news for now
    response = supabase.table("news_alerts").select("*").order("created_at", desc=True).limit(20).execute()
    return response.data
