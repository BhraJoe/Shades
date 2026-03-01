// New Arrivals API for Vercel

export default async function handler(req, res) {
     const { method } = req;

     // Set CORS headers
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

     // Handle preflight
     if (method === 'OPTIONS') {
          return res.status(200).end();
     }

     // GET new arrivals
     if (method === 'GET') {
          try {
               const { createClient } = await import('@supabase/supabase-js');

               const supabaseUrl = 'https://llyjnqdhxxnrqgraicuh.supabase.co';
               const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOizdXBhYmFzZSIsInJlZiI6ImxseWpucWRoeHhucnFncmFpY3VoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI2NDYxNCwiZXhwIjoyMDg2ODQwNjE0fQ.YgF6VxgPDQU79DRzh8d1jAGWr98Aoj1iZcgJGNE0Cgo';

               const supabase = createClient(supabaseUrl, supabaseKey);

               const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_new', true);

               if (error) {
                    console.error('Supabase error:', error);
                    return res.status(500).json({ error: error.message });
               }

               return res.status(200).json(data || []);
          } catch (error) {
               console.error('Error:', error);
               return res.status(500).json({ error: error.message });
          }
     }

     // Method not allowed
     return res.status(405).json({ error: 'Method not allowed' });
}
