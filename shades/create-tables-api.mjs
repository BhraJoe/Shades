import https from 'https';

const SUPABASE_ACCESS_TOKEN = 'sbp_b6f803c15a98b6483a3c2152dad973eb25a35e33';
const PROJECT_REF = 'rofkykdunbsnubguoukv';

function makeRequest(method, path, data = null) {
     return new Promise((resolve, reject) => {
          const options = {
               hostname: 'api.supabase.com',
               port: 443,
               path: path,
               method: method,
               headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`
               }
          };

          const req = https.request(options, (res) => {
               let responseData = '';
               res.on('data', (chunk) => { responseData += chunk; });
               res.on('end', () => {
                    try {
                         if (responseData) {
                              resolve(JSON.parse(responseData));
                         } else {
                              resolve({});
                         }
                    } catch (e) {
                         resolve(responseData);
                    }
               });
          });

          req.on('error', reject);
          if (data) {
               req.write(JSON.stringify(data));
          }
          req.end();
     });
}

async function createTables() {
     console.log('Creating categories table via Management API...');

     // First, let's check if the table exists by querying it
     try {
          // Try to create categories table using SQL via projects API
          const result = await makeRequest('POST', `/v1/projects/${PROJECT_REF}/sql`, {
               query: `
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
      `
          });
          console.log('Categories table result:', result);
     } catch (error) {
          console.log('Categories error:', error.message);
     }

     console.log('\nCreating orders table via Management API...');

     try {
          const result = await makeRequest('POST', `/v1/projects/${PROJECT_REF}/sql`, {
               query: `
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
      `
          });
          console.log('Orders table result:', result);
     } catch (error) {
          console.log('Orders error:', error.message);
     }
}

createTables().catch(console.error);
