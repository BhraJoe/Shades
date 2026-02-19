// Paystack payment service
// Uses the Paystack inline script loaded in index.html

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

/**
 * Initialize Paystack payment
 * @param {Object} options - Payment options
 * @param {string} options.email - Customer email
 * @param {number} options.amount - Amount in kobo (Naira) or smallest currency unit
 * @param {string} options.currency - Currency code (NGN, GHS, USD, etc.)
 * @param {string} options.reference - Unique payment reference
 * @param {string} options.customerName - Customer full name
 * @param {string} options.callback - Callback function on successful payment
 * @param {Function} options.onClose - Callback function when payment modal closes
 * @returns {Promise} - Promise that resolves with payment reference
 */
export const initializePaystackPayment = ({
     email,
     amount,
     currency = 'NGN',
     reference,
     customerName,
     callback,
     onClose
}) => {
     return new Promise((resolve, reject) => {
          if (!window.PaystackPop) {
               reject(new Error('Paystack script not loaded'));
               return;
          }

          const paystack = window.PaystackPop({
               key: PAYSTACK_PUBLIC_KEY,
               email: email,
               amount: amount, // Amount in kobo (smallest currency unit)
               currency: currency,
               ref: reference,
               customer: {
                    email: email,
                    name: customerName
               },
               metadata: {
                    custom_fields: []
               },
               callback: (response) => {
                    if (callback) {
                         callback(response);
                    }
                    resolve(response);
               },
               onClose: () => {
                    if (onClose) {
                         onClose();
                    }
                    reject(new Error('Payment cancelled by user'));
               }
          });

          paystack.openIframe();
     });
};

/**
 * Generate a unique payment reference
 * @returns {string} - Unique reference string
 */
export const generatePaymentReference = () => {
     const timestamp = Date.now();
     const random = Math.random().toString(36).substring(2, 10);
     return `PS_${timestamp}_${random}`;
};

/**
 * Convert amount to kobo (for NGN) or smallest currency unit
 * @param {number} amount - Amount in main currency unit
 * @param {string} currency - Currency code
 * @returns {number} - Amount in smallest currency unit
 */
export const convertToSmallestUnit = (amount, currency = 'NGN') => {
     // For NGN, multiply by 100 to get kobo
     // For GHS, multiply by 100 to get pesewas
     // For USD, multiply by 100 to get cents
     const multipliers = {
          NGN: 100,
          GHS: 100,
          USD: 100,
          EUR: 100,
          GBP: 100
     };

     const multiplier = multipliers[currency] || 100;
     return Math.round(amount * multiplier);
};

/**
 * Check if Paystack is available
 * @returns {boolean} - True if Paystack script is loaded
 */
export const isPaystackAvailable = () => {
     return !!window.PaystackPop;
};

export default {
     initializePaystackPayment,
     generatePaymentReference,
     convertToSmallestUnit,
     isPaystackAvailable
};
