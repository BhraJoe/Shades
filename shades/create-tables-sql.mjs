// Script to create subscribers and messages tables in Supabase
// Run this in Supabase SQL Editor or we can try via API

const createTablesSQL = `
// Create subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

// Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

// Allow anyone to subscribe
CREATE POLICY "Allow public insert subscribers" ON public.subscribers
    FOR INSERT WITH CHECK (true);

// Allow anyone to view
CREATE POLICY "Allow public select subscribers" ON public.subscribers
    FOR SELECT USING (true);

// Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

// Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

// Allow anyone to submit
CREATE POLICY "Allow public insert messages" ON public.messages
    FOR INSERT WITH CHECK (true);

// Allow anyone to view
CREATE POLICY "Allow public select messages" ON public.messages
    FOR SELECT USING (true);
`;

console.log('Please run this SQL in your Supabase SQL Editor:');
console.log(createTablesSQL);
console.log('\nOr go to: https://supabase.com/dashboard/project/rofkykdunbsnubguoukv/sql-editor');
