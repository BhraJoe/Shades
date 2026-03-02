// Update admin password in Supabase
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = 'https://rofkykdunbsnubguoukv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZmt5a2R1bmJzbnViZ3VvdWt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ2MTY3NCwiZXhwIjoyMDg3MDM3Njc0fQ.49gxdzYRA8gtNUFe8GjdJabBWdv4Kge1XDz0qWtRVic';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAdminPassword() {
     // Generate hash for 'admin123'
     const hash = bcrypt.hashSync('admin123', 10);
     console.log('New hash:', hash);

     const { data, error } = await supabase
          .from('users')
          .update({ password_hash: hash })
          .eq('username', 'admin')
          .select();

     if (error) {
          console.log('Error:', error.message);
     } else {
          console.log('Updated admin password. Admin can now login with:');
          console.log('Username: admin');
          console.log('Password: admin123');
     }
}

updateAdminPassword();
