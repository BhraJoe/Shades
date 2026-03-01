import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://rofkykdunbsnubguoukv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZmt5a2R1bmJzbnViZ3VvdWt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ2MTY3NCwiZXhwIjoyMDg3MDM3Njc0fQ.49gxdzYRA8gtNUFe8GjdJabBWdv4Kge1XDz0qWtRVic';

const supabase = createClient(supabaseUrl, supabaseKey, {
     auth: {
          autoRefreshToken: false,
          persistSession: false
     }
});

const uploadsDir = path.join(__dirname, 'uploads/products');

async function uploadImages() {
     console.log('Starting image upload to Supabase Storage...\n');

     // First, try to create a bucket (ignore error if it exists)
     const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('products', {
          public: true
     });

     if (bucketError && !bucketError.message.includes('already exists')) {
          console.log('Bucket creation error:', bucketError.message);
     } else {
          console.log('Bucket "products" ready');
     }

     // Get all image files
     const files = fs.readdirSync(uploadsDir).filter(f =>
          f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')
     );

     console.log(`Found ${files.length} image files\n`);

     const imageUrls = {};

     for (const file of files) {
          const filePath = path.join(uploadsDir, file);
          const fileBuffer = fs.readFileSync(filePath);
          const contentType = file.endsWith('.png') ? 'image/png' : 'image/jpeg';

          console.log(`Uploading ${file}...`);

          const { data, error } = await supabase.storage
               .from('products')
               .upload(`products/${file}`, fileBuffer, {
                    contentType,
                    upsert: true
               });

          if (error) {
               console.log(`  Error: ${error.message}`);
          } else {
               // Get public URL
               const { data: urlData } = supabase.storage
                    .from('products')
                    .getPublicUrl('products/' + file);

               imageUrls[file] = urlData.publicUrl;
               console.log(`  Success: ${urlData.publicUrl}`);
          }
     }

     console.log('\n=== Image Upload Complete ===\n');
     console.log('Image URLs mapping:');
     console.log(JSON.stringify(imageUrls, null, 2));

     // Now update the products in the database
     console.log('\nUpdating products in database...');

     // Get all products
     const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*');

     if (productsError) {
          console.log('Error fetching products:', productsError.message);
          return;
     }

     console.log(`Found ${products.length} products`);

     for (const product of products) {
          if (product.images && product.images.length > 0) {
               const oldImage = product.images[0];
               // Extract filename from path like "/uploads/products/filename.jpeg"
               const filename = oldImage.split('/').pop();

               if (imageUrls[filename]) {
                    console.log(`Updating product ${product.id}(${product.name}): `);
                    console.log(`  Old URL: ${oldImage}`);
                    console.log(`  New URL: ${imageUrls[filename]}`);

                    const { error: updateError } = await supabase
                         .from('products')
                         .update({ images: [imageUrls[filename]] })
                         .eq('id', product.id);

                    if (updateError) {
                         console.log(`  Update error: ${updateError.message}`);
                    } else {
                         console.log(`  Updated successfully`);
                    }
               }
          }
     }

     console.log('\n=== Done ===');
}

uploadImages().catch(console.error);
