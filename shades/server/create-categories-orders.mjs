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

async function createCategoriesTable() {
     console.log('Creating categories table...');

     try {
          // Try using the tables API
          const result = await makeRequest('POST', `/v1/projects/${PROJECT_REF}/tables`, {
               name: 'categories',
               schema: 'public',
               columns: [
                    { name: 'id', type: 'bigint', is_identity: true, identity_default: 'always', is_primary_key: true },
                    { name: 'name', type: 'text', is_nullable: false },
                    { name: 'slug', type: 'text', is_nullable: false },
                    { name: 'description', type: 'text', is_nullable: true, default_value: '' },
                    { name: 'created_at', type: 'timestamp with time zone', is_nullable: true, default_value: 'now()' }
               ]
          });
          console.log('Categories table result:', result);
          return result;
     } catch (error) {
          console.log('Categories error:', error.message);
          return null;
     }
}

async function main() {
     console.log('=== Creating Supabase Tables ===\n');

     await createCategoriesTable();

     console.log('\n=== Done ===');
     console.log('\nNote: The tables may need to be created manually in the Supabase dashboard.');
     console.log('Please run the SQL from SUPABASE-TABLES-SETUP.sql in the Supabase SQL Editor.');
}

main().catch(console.error);
