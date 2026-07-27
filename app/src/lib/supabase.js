import { createClient } from '@supabase/supabase-js';

// Mesma conexão que o projeto já usava (cliente anon direto). Valores fixos —
// a chave anon é pública por design (o acesso é controlado por RLS no Supabase).
// Fixamos aqui para não depender de env vars antigas/inválidas no Vercel.
const SUPABASE_URL = 'https://iuwvwhofxuvmwnpbsnth.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1d3Z3aG9meHV2bXducGJzbnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MzA3OTMsImV4cCI6MjEwMDQwNjc5M30.0kvXT5Dgr68nyOJGRoSlKx25kUlu4XCK-zB9yXCX9Dk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
