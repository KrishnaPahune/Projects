import { createContext, useContext, useState } from "react";

const PaymentContext = createContext();

export const usePayment = () => {
  return useContext(PaymentContext);
};

export const PaymentProvider = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

  // Create Razorpay order
  const createRazorpayOrder = async (orderData) => {
    try {
      setIsProcessing(true);
      setPaymentError(null);

      // Format payload to match backend API expectations
      const payload = {
        userEmail: orderData.userEmail,
        shippingData: orderData.shippingData,
        items: orderData.items.map(item => ({
          ...item,
          id: String(item.id), // Convert id to string
        })),
        total: orderData.total,
      };

      console.log("Creating order with payload:", payload);

      const response = await fetch(`${BACKEND_URL}/api/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create order";
        try {
          const errorData = await response.json();
          console.error("Backend error response:", JSON.stringify(errorData, null, 2));
          errorMessage = errorData.detail || JSON.stringify(errorData);
        } catch (parseError) {
          console.error("Could not parse error response");
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Open Razorpay checkout
  const openRazorpayCheckout = (orderData, onSuccess, onError) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Create order first
        const order = await createRazorpayOrder(orderData);

        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => {
          const options = {
            key: RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Sagar",
            description: "Online Shopping",
            order_id: order.order_id,
            handler: async (response) => {
              try {
                // Verify payment on backend
                const verifyResponse = await fetch(
                  `${BACKEND_URL}/api/verify-payment`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_signature: response.razorpay_signature,
                    }),
                  }
                );

                if (verifyResponse.ok) {
                  const verifyData = await verifyResponse.json();
                  onSuccess({
                    ...verifyData,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                  });
                  resolve(verifyData);
                } else {
                  throw new Error("Payment verification failed");
                }
              } catch (error) {
                onError(error.message);
                reject(error);
              }
            },
            prefill: {
              name: orderData.shippingData.name,
              email: orderData.userEmail,
              contact: orderData.shippingData.phone,
            },
            theme: {
              color: "#FF6B35",
            },
          };

          const rzp = new window.Razorpay(options);

          rzp.on("payment.failed", (response) => {
            const error = new Error(response.error.description);
            onError(error.message);
            reject(error);
          });

          rzp.open();
        };

        script.onerror = () => {
          const error = new Error("Failed to load Razorpay");
          onError(error.message);
          reject(error);
        };

        document.body.appendChild(script);
      } catch (error) {
        onError(error.message);
        reject(error);
      }
    });
  };

  // Verify payment signature
  const verifyPayment = async (paymentDetails) => {
    try {
      setIsProcessing(true);
      setPaymentError(null);

      const response = await fetch(`${BACKEND_URL}/api/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentDetails),
      });

      if (!response.ok) {
        throw new Error("Payment verification failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const value = {
    isProcessing,
    paymentError,
    createRazorpayOrder,
    openRazorpayCheckout,
    verifyPayment,
    BACKEND_URL,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};