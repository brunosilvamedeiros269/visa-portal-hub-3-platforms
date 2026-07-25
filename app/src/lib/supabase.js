import { createClient } from '@supabase/supabase-js';

// Mesma conexão que o projeto já usava (cliente anon direto). Prefere env vars
// do Vercel; cai para os valores conhecidos (chave anon é pública por design).
const url = import.meta.env.VITE_SUPABASE_URL || 'https://iuwvwhofxuvmwnpbsnth.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1d3Z3aG9meHV2bXducGJzbnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MzA3OTMsImV4cCI6MjEwMDQwNjc5M30.0kvXT5Dgr68nyOJGRoSlKx25kUlu4XCK-zB9yXCX9Dk';

export const supabase = createClient(url, key);
