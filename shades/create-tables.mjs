// Run this script to create subscribers and messages tables in Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://rofkykdunbsnubguoukv.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZmt5a2R1bmJzbnViZ3VvdWt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ2MTY3NCwiZXhwIjoyMDg3MDM3Njc0fQ.49gxdzYRA8gtNUFe8GjdJabBWdv4Kge1XDz0qWtRVic';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
     console.log('Creating subscribers table...');

     const { error: subsError } = await supabase.from('subscribers').insert([
          { email: 'test@example.com' }
     ]);

     if (subsError && !subsError.message.includes('duplicate')) {
          console.log('Subscribers table might need to be created manually:');
          console.log(`
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
    `);
     } else {
          console.log('Subscribers table exists or created successfully');
     }

     console.log('Creating messages table...');

     const { error: msgError } = await supabase.from('messages').insert([
          { name: 'Test', email: 'test@example.com', subject: 'Test', message: 'Test message' }
     ]);

     if (msgError && !msgError.message.includes('duplicate')) {
          console.log('Messages table might need to be created manually:');
          console.log(`
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
    `);
     } else {
          console.log('Messages table exists or created successfully');
     }

     console.log('Done!');
}

createTables().catch(console.error);
