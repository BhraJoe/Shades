// Admin categories API using Supabase

export default async function handler(req, res) {
     // Set CORS headers
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

     // Handle preflight
     if (req.method === 'OPTIONS') {
          return res.status(200).end();
     }

     // Parse path from URL
     let path = '/';
     try {
          const urlObj = new URL(req.url || '/', `http://${req.headers?.host || 'localhost'}`);
          path = urlObj.pathname;
     } catch (e) {
          path = '/api/admin/categories';
     }

     console.log('Admin Categories API - Path:', path, 'Method:', req.method);

     // Import Supabase dynamically
     const { createClient } = await import('@supabase/supabase-js');

     const supabaseUrl = 'https://llyjnqdhxxnrqgraicuh.supabase.co';
     const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseWpucWRoeHhucnFncmFpY3VoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI2NDYxNCwiZXhwIjoyMDg2ODQwNjE0fQ.YgF6VxgPDQU79DRzh8d1jAGWr98Aoj1iZcgJGNE0Cgo';

     const supabase = createClient(supabaseUrl, supabaseKey);

     // GET /api/admin/categories - get all categories
     if (req.method === 'GET' && (path === '/api/admin/categories' || path === '/api/admin/categories/')) {
          try {
               const { data, error } = await supabase.from('categories').select('*').order('id', { ascending: true });

               if (error) {
                    console.error('Supabase error:', error);
                    return res.status(500).json({ error: error.message });
               }

               return res.status(200).json(data || []);
          } catch (error) {
               console.error('Error fetching categories:', error);
               return res.status(500).json({ error: 'Failed to fetch categories' });
          }
     }

     // POST /api/admin/categories - create category
     if (req.method === 'POST' && (path === '/api/admin/categories' || path === '/api/admin/categories/')) {
          try {
               let category = req.body;
               if (!category) {
                    return res.status(400).json({ error: 'No category data provided' });
               }

               if (typeof category === 'string') {
                    try {
                         category = JSON.parse(category);
                    } catch (e) {
                         return res.status(400).json({ error: 'Invalid JSON' });
                    }
               }

               console.log('Creating category:', category);

               // Generate slug from name if not provided
               const slug = category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

               const newCategory = {
                    name: category.name,
                    slug: slug,
                    description: category.description || '',
               };

               const { data, error } = await supabase.from('categories').insert([newCategory]).select();

               if (error) {
                    console.error('Supabase error:', error);
                    return res.status(500).json({ error: error.message });
               }

               console.log('Category created:', data);
               return res.status(201).json(data[0]);
          } catch (error) {
               console.error('Error creating category:', error);
               return res.status(500).json({ error: 'Failed to create category' });
          }
     }

     // DELETE /api/admin/categories/:id - delete category
     const deleteMatch = path.match(/^\/api\/admin\/categories\/(\d+)$/);
     if (req.method === 'DELETE' && deleteMatch) {
          const categoryId = parseInt(deleteMatch[1]);

          try {
               const { error } = await supabase.from('categories').delete().eq('id', categoryId);

               if (error) {
                    console.error('Supabase error:', error);
                    return res.status(500).json({ error: error.message });
               }

               console.log('Category deleted:', categoryId);
               return res.status(200).json({ message: 'Category deleted successfully' });
          } catch (error) {
               console.error('Error deleting category:', error);
               return res.status(500).json({ error: 'Failed to delete category' });
          }
     }

     // 404 for unmatched routes
     return res.status(404).json({ error: 'Not found' });
}
