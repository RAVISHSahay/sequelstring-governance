from fastapi import APIRouter
from app.api.api_v1.endpoints import dates, social, intelligence, calls

api_router = APIRouter()

api_router.include_router(dates.router, prefix="/contacts", tags=["dates"])
api_router.include_router(social.router, prefix="/contacts", tags=["social"])
api_router.include_router(intelligence.router, prefix="/intelligence", tags=["intelligence"])
api_router.include_router(calls.router, prefix="/calls", tags=["calls"])
