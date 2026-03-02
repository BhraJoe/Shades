// Quick script to create missing tables in Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rofkykdunbsnubguoukv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZmt5a2R1bmJzbnViZ3VvdWt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ2MTY3NCwiZXhwIjoyMDg3MDM3Njc0fQ.49gxdzYRA8gtNUFe8GjdJabBWdv4Kge1XDz0qWtRVic';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createMissingTables() {
     console.log('Checking/creating subscribers table...');

     // Try to insert - will fail if table doesn't exist
     try {
          await supabase.from('subscribers').insert([{ email: 'temp_' + Date.now() + '@test.com' }]);
          console.log('✓ Subscribers table exists');
     } catch (err) {
          if (err.message.includes('relation "subscribers" does not exist')) {
               console.log('Creating subscribers table...');
               // Table doesn't exist, try to create via RPC or alternative
               console.log('Please run this SQL in Supabase dashboard:');
               console.log(`
CREATE TABLE subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view" ON subscribers FOR SELECT USING (true);
      `);
          } else if (err.message.includes('duplicate')) {
               console.log('✓ Subscribers table exists (has data)');
          }
     }

     console.log('\nChecking/creating messages table...');
     try {
          await supabase.from('messages').insert([{ name: 'Test', email: 'test@test.com', subject: 'Test', message: 'Test' }]);
          console.log('✓ Messages table exists');
     } catch (err) {
          if (err.message.includes('relation "messages" does not exist')) {
               console.log('Please run this SQL in Supabase dashboard:');
               console.log(`
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view" ON messages FOR SELECT USING (true);
      `);
          } else if (err.message.includes('duplicate')) {
               console.log('✓ Messages table exists (has data)');
          }
     }
}

createMissingTables();
