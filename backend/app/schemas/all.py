from typing import Optional, List
from datetime import datetime, date, time
from uuid import UUID
from pydantic import BaseModel, Field, EmailStr

# --- Common ---
class APIResponse(BaseModel):
    success: bool
    data: Optional[dict | List[dict]] = None
    message: Optional[str] = None

# --- Feature 1: Important Dates ---
class ImportantDateBase(BaseModel):
    type: str # birthday, anniversary, etc.
    label: Optional[str] = None
    date_day: int = Field(..., ge=1, le=31)
    date_month: int = Field(..., ge=1, le=12)
    year: Optional[int] = None
    send_time: time = time(9, 0)
    timezone: str = "UTC"
    email_template_id: Optional[UUID] = None
    repeat_annually: bool = True
    opt_out: bool = False
    is_active: bool = True

class ImportantDateCreate(ImportantDateBase):
    pass

class ImportantDateUpdate(BaseModel):
    type: Optional[str] = None
    date_day: Optional[int] = None
    date_month: Optional[int] = None
    send_time: Optional[time] = None
    is_active: Optional[bool] = None

class ImportantDateResponse(ImportantDateBase):
    id: UUID
    contact_id: UUID
    created_at: datetime
    updated_at: datetime

# --- Feature 2: Social Profiles ---
class SocialProfileBase(BaseModel):
    platform: str
    profile_url: str
    profile_id: str
    display_name: str
    handle: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    followers: Optional[int] = 0

class SocialProfileCreate(SocialProfileBase):
    pass

class SocialProfileResponse(SocialProfileBase):
    id: UUID
    contact_id: UUID
    last_synced_at: Optional[datetime] = None
    is_verified: bool

class SocialEventResponse(BaseModel):
    id: UUID
    contact_id: UUID
    social_account_id: UUID
    platform: str
    event_type: str
    title: str
    content: str
    event_url: str
    event_time: datetime
    is_read: bool = False
    created_at: datetime

# --- Feature 3: Intelligence ---
class NewsAlertBase(BaseModel):
    title: str
    summary: Optional[str] = None
    source_url: str
    source_name: Optional[str] = None
    published_at: Optional[datetime] = None
    sentiment_score: Optional[float] = None

class NewsAlertResponse(NewsAlertBase):
    id: UUID
    account_id: UUID
    created_at: datetime

# --- Feature 4: Calls ---
class CallBase(BaseModel):
    type: str # inbound, outbound
    status: str
    scheduled_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    duration: Optional[int] = None
    recording_url: Optional[str] = None
    transcript_text: Optional[str] = None

class CallCreate(CallBase):
    contact_id: UUID
    user_id: UUID

class CallResponse(CallBase):
    id: UUID
    contact_id: Optional[UUID]
    user_id: UUID
    created_at: datetime
