// Paystack Payment API for Vercel
// Handles payment initialization and verification

export default async function handler(req, res) {
     const { method } = req;

     // Add debug logging
     console.log('=== PAYSTACK API CALLED ===');
     console.log('Method:', method);
     console.log('URL:', req.url);
     console.log('Headers:', JSON.stringify(req.headers));

     // Parse path from URL
     let path = '/';
     let pathParts = [];
     try {
          const urlObj = new URL(req.url || '/', `http://${req.headers?.host || 'localhost'}`);
          path = urlObj.pathname;
          pathParts = path.split('/').filter(p => p);
          console.log('Parsed path:', path);
          console.log('Path parts:', pathParts);
     } catch (e) {
          path = '/api/paystack';
     }

     // Set CORS headers
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

     // Handle preflight
     if (method === 'OPTIONS') {
          return res.status(200).end();
     }

     // Get Paystack secret key - use test key for testing
     let PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

     // Use test key for now
     if (!PAYSTACK_SECRET_KEY) {
          PAYSTACK_SECRET_KEY = 'sk_test_bde739aec1a54f5266a40fa1ef1d1ed4ef12e825';
          console.log('Using Paystack TEST secret key');
     }

     // Clean the key - remove any whitespace or special characters
     PAYSTACK_SECRET_KEY = PAYSTACK_SECRET_KEY.replace(/[^a-zA-Z0-9_-]/g, '');

     console.log('Paystack API: Checking secret key...');
     console.log('Paystack secret key exists:', !!PAYSTACK_SECRET_KEY);
     console.log('Paystack secret key first 10 chars:', PAYSTACK_SECRET_KEY ? PAYSTACK_SECRET_KEY.substring(0, 10) + '...' : 'NOT SET');

     if (!PAYSTACK_SECRET_KEY) {
          console.error('Paystack secret key is not configured');
          console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('PAYSTACK') || k.includes('SUPABASE') || k.includes('FRONTEND')));
          return res.status(500).json({ error: 'Payment service not configured' });
     }

     const PAYSTACK_BASE_URL = 'https://api.paystack.co';

     // Route: POST /api/paystack/initialize
     if (method === 'POST' && pathParts[2] === 'initialize') {
          try {
               const { email, amount, currency = 'GHS', reference, metadata, channel } = req.body;

               if (!email || !amount) {
                    return res.status(400).json({
                         error: 'Missing required fields: email, amount'
                    });
               }

               const axios = (await import('axios')).default;

               // Build request payload
               const payload = {
                    email,
                    amount: Math.round(amount),
                    currency,
                    metadata: metadata || {},
                    callback_url: `${process.env.FRONTEND_URL || 'https://shades-ruddy.vercel.app'}/checkout?payment=success&reference=${reference}`
               };

               // Use our reference if provided
               if (reference) {
                    payload.reference = reference;
               }

               // For mobile money, add channel parameter
               if (channel === 'mobile_money') {
                    payload.channel = ['mobile_money'];
                    // Add mobile money specific metadata
                    payload.metadata = {
                         ...payload.metadata,
                         mobile_money: {
                              phone: metadata?.phone || ''
                         }
                    };
               }

               console.log('Paystack initialize payload:', JSON.stringify(payload, null, 2));

               const response = await axios.post(
                    `${PAYSTACK_BASE_URL}/transaction/initialize`,
                    payload,
                    {
                         headers: {
                              Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                              'Content-Type': 'application/json'
                         }
                    }
               );

               return res.status(200).json(response.data.data);
          } catch (error) {
               console.error('Paystack initialize error:', error.response?.data || error.message);
               return res.status(500).json({
                    error: error.response?.data?.message || 'Failed to initialize payment'
               });
          }
     }

     // Route: GET /api/paystack/verify/:reference
     if (method === 'GET' && pathParts[2] === 'verify' && pathParts[3]) {
          try {
               const reference = pathParts[3];
               console.log('Verifying payment with reference:', reference);
               console.log('Using secret key:', PAYSTACK_SECRET_KEY ? PAYSTACK_SECRET_KEY.substring(0, 10) + '...' : 'NOT SET');

               const axios = (await import('axios')).default;

               const response = await axios.get(
                    `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
                    {
                         headers: {
                              Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
                         }
                    }
               );

               console.log('Paystack verify response:', response.data);

               const paymentData = response.data.data;

               if (paymentData.status === 'success') {
                    return res.status(200).json({
                         verified: true,
                         status: paymentData.status,
                         amount: paymentData.amount,
                         currency: paymentData.currency,
                         customer: paymentData.customer,
                         reference: paymentData.reference
                    });
               } else if (paymentData.status === 'pending' || paymentData.status === 'send_otp') {
                    // Mobile money pending - not failed
                    return res.status(200).json({
                         verified: false,
                         status: paymentData.status,
                         message: 'Payment is pending. Please complete the mobile money OTP verification.',
                         reference: paymentData.reference
                    });
               } else {
                    return res.status(400).json({
                         verified: false,
                         status: paymentData.status,
                         message: 'Payment not successful'
                    });
               }
          } catch (error) {
               console.error('Paystack verify error:', error.response?.data || error.message);
               return res.status(500).json({
                    error: error.response?.data?.message || 'Failed to verify payment'
               });
          }
     }

     // Route not found
     return res.status(404).json({ error: 'Endpoint not found' });
}
