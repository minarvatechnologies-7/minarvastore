import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cdtndyhouwvhszlpedmw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdG5keWhvdXd2aHN6bHBlZG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTI5ODYsImV4cCI6MjA5NTcyODk4Nn0.zUaqJrq-RfIv5gcHrgDIh3VlGmI0B5AsYayjcryOoVE'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
