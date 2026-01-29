-- Create tasks table for tracking to-dos and action items
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'task', -- task, call, email, meeting, follow_up, demo, proposal
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed, cancelled, deferred
  due_date DATE,
  due_time TIME,
  reminder_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT, -- daily, weekly, monthly, custom
  recurrence_end_date DATE,
  parent_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Tasks RLS policies
CREATE POLICY "Users can view all tasks" ON public.tasks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create tasks" ON public.tasks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own or assigned tasks" ON public.tasks
  FOR UPDATE TO authenticated USING (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can delete their own tasks" ON public.tasks
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_opportunity_id ON public.tasks(opportunity_id);
CREATE INDEX idx_tasks_account_id ON public.tasks(account_id);
CREATE INDEX idx_tasks_contact_id ON public.tasks(contact_id);
CREATE INDEX idx_tasks_lead_id ON public.tasks(lead_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);