// Categories API for Vercel

export default async function handler(req, res) {
     const { method } = req;

     // Parse path from URL
     let path = '/';
     try {
          const urlObj = new URL(req.url || '/', `http://${req.headers?.host || 'localhost'}`);
          path = urlObj.pathname;
     } catch (e) {
          path = '/api/categories';
     }

     // Set CORS headers
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

     // Handle preflight
     if (method === 'OPTIONS') {
          return res.status(200).end();
     }

     // Supabase credentials
     const supabaseUrl = 'https://rofkykdunbsnubguoukv.supabase.co';
     const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZmt5a2R1bmJzbnViZ3VvdWt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ2MTY3NCwiZXhwIjoyMDg3MDM3Njc0fQ.49gxdzYRA8gtNUFe8GjdJabBWdv4Kge1XDz0qWtRVic';

     // GET all categories
     if (method === 'GET' && (path === '/api/categories' || path === '/categories')) {
          try {
               const { createClient } = await import('@supabase/supabase-js');
               const supabase = createClient(supabaseUrl, supabaseKey);

               const { data, error } = await supabase
                    .from('categories')
                    .select('*')
                    .order('id', { ascending: true });

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

     // 404 for unmatched routes
     return res.status(404).json({ error: 'Not found' });
}
