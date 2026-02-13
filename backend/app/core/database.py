from supabase import create_client, Client
from app.core.config import settings

class Database:
    client: Client = None

    def connect(self):
        try:
            self.client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            print("Initialized Supabase Client")
        except Exception as e:
            print(f"Failed to initialize Supabase Client: {e}")
            raise e

    def get_client(self) -> Client:
        if not self.client:
            self.connect()
        return self.client

db = Database()

def get_supabase() -> Client:
    return db.get_client()
