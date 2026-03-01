import https from 'https';

const supabaseUrl = 'https://rofkykdunbsnubguoukv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZmt5a2R1bmJzbnViZ3VvdWt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ2MTY3NCwiZXhwIjoyMDg3MDM3Njc0fQ.49gxdzYRA8gtNUFe8GjdJabBWdv4Kge1XDz0qWtRVic';

function makeRequest(query) {
     return new Promise((resolve, reject) => {
          const postData = JSON.stringify({ query });

          const options = {
               hostname: 'rofkykdunbsnubguoukv.supabase.co',
               port: 443,
               path: '/rest/v1/rpc/exec_sql',
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
               }
          };

          const req = https.request(options, (res) => {
               let data = '';
               res.on('data', (chunk) => { data += chunk; });
               res.on('end', () => {
                    try {
                         resolve(JSON.parse(data));
                    } catch (e) {
                         resolve(data);
                    }
               });
          });

          req.on('error', reject);
          req.write(postData);
          req.end();
     });
}

async function main() {
     console.log('Creating categories table...');

     try {
          const result = await makeRequest(`
      CREATE TABLE IF NOT EXISTS categories (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
      
      INSERT INTO categories (name, slug, description) VALUES
        ('Aviator', 'aviator', 'Classic aviator style sunglasses'),
        ('Wayfarer', 'wayfarer', 'Iconic wayfarer style sunglasses'),
        ('Clubmaster', 'clubmaster', 'Retro clubmaster browline sunglasses'),
        ('Round', 'round', 'Vintage round frame sunglasses'),
        ('Cat-Eye', 'cat-eye', 'Feminine cat-eye style sunglasses'),
        ('Rectangular', 'rectangular', 'Modern rectangular frame sunglasses'),
        ('Oversized', 'oversized', 'Bold oversized frame sunglasses'),
        ('Sport', 'sport', 'Athletic sport sunglasses')
      ON CONFLICT (name) DO NOTHING;
    `);
          console.log('Categories result:', result);
     } catch (error) {
          console.log('Categories error:', error.message);
     }

     console.log('Creating orders table...');

     try {
          const result = await makeRequest(`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGSERIAL PRIMARY KEY,
        order_number TEXT NOT NULL UNIQUE,
        customer_email TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        shipping_address TEXT,
        shipping_city TEXT,
        shipping_state TEXT,
        shipping_zip TEXT,
        shipping_country TEXT,
        shipping_phone TEXT,
        subtotal REAL NOT NULL DEFAULT 0,
        shipping REAL NOT NULL DEFAULT 0,
        tax REAL NOT NULL DEFAULT 0,
        total REAL NOT NULL DEFAULT 0,
        status TEXT DEFAULT 'confirmed',
        items JSONB NOT NULL DEFAULT '[]',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Anyone can view orders" ON orders FOR SELECT USING (true);
      CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);
    `);
          console.log('Orders result:', result);
     } catch (error) {
          console.log('Orders error:', error.message);
     }
}

main().catch(console.error);
