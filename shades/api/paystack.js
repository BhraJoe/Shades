// Paystack Payment API for Vercel
// Handles payment initialization and verification

export default async function handler(req, res) {
     const { method } = req;

     // Parse path from URL
     let path = '/';
     let pathParts = [];
     try {
          const urlObj = new URL(req.url || '/', `http://${req.headers?.host || 'localhost'}`);
          path = urlObj.pathname;
          pathParts = path.split('/').filter(p => p);
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

     // Get Paystack secret key
     const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

     if (!PAYSTACK_SECRET_KEY) {
          console.error('Paystack secret key is not configured');
          return res.status(500).json({ error: 'Payment service not configured' });
     }

     const PAYSTACK_BASE_URL = 'https://api.paystack.co';

     // Route: POST /api/paystack/initialize
     if (method === 'POST' && pathParts[2] === 'initialize') {
          try {
               const { email, amount, currency = 'NGN', reference, metadata } = req.body;

               if (!email || !amount || !reference) {
                    return res.status(400).json({
                         error: 'Missing required fields: email, amount, reference'
                    });
               }

               const axios = (await import('axios')).default;

               const response = await axios.post(
                    `${PAYSTACK_BASE_URL}/transaction/initialize`,
                    {
                         email,
                         amount: Math.round(amount),
                         currency,
                         reference,
                         metadata: metadata || {},
                         callback_url: `${process.env.FRONTEND_URL || 'https://shades-ruddy.vercel.app'}/?payment=success`
                    },
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
               const reference = pathParts[2];
               const axios = (await import('axios')).default;

               const response = await axios.get(
                    `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
                    {
                         headers: {
                              Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
                         }
                    }
               );

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
