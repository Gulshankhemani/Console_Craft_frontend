import React, { useEffect, useState } from "react";
import axios from "axios";
import { gsap } from "gsap";
import Button from "../Components/Button.jsx"; // Adjust the import path based on your file structure

const Cart = () => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    fetchCart();
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!loading && cart.items.length > 0) {
      gsap.fromTo(
        ".cart-item",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        }
      );
    }
  }, [loading, cart.items]);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view your cart.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/v1/cart", {
        headers: {
          Authorization: `Bearer ${token}`, // Fixed string interpolation
        },
        withCredentials: true,
      });
      console.log("API Response:", response.data);
      const cartData = response.data.message || { items: [], totalAmount: 0 };
      setCart({
        items: Array.isArray(cartData.items) ? cartData.items : [],
        totalAmount: cartData.totalAmount || 0,
      });
      setError(null);
    } catch (err) {
      console.error("Fetch Cart Error:", err.response || err.message);
      setError(err.response?.data?.message || "Failed to fetch cart");
      setCart({ items: [], totalAmount: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to remove items from your cart.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:8000/api/v1/cart/${productId}`, // Fixed string interpolation
        {
          headers: {
            Authorization: `Bearer ${token}`, // Fixed string interpolation
          },
          withCredentials: true,
        }
      );
      console.log("Remove Response:", response.data);
      const cartData = response.data.message || { items: [], totalAmount: 0 };
      setCart({
        items: Array.isArray(cartData.items) ? cartData.items : [],
        totalAmount: cartData.totalAmount || 0,
      });
      setError(null);
    } catch (err) {
      console.error("Remove Error:", err.response || err.message);
      setError(
        err.response?.data?.message || "Failed to remove item from cart"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPay = async () => {
    if (loading || cart.totalAmount <= 0) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to proceed with payment.");
      return;
    }

    try {
      setPaymentProcessing(true);

      // Step 1: Create a Razorpay order
      const orderResponse = await axios.post(
        "http://localhost:8000/api/v1/payment/create-order",
        { amount: cart.totalAmount || 21998 }, // Default amount for testing
        {
          headers: {
            Authorization: `Bearer ${token}`, // Fixed string interpolation
          },
          withCredentials: true,
        }
      );

      const { id: orderId, amount } = orderResponse.data.data;

      // Step 2: Get user info for prefilling (optional)
      // You can fetch user details from your API or localStorage if available
      const userEmail = localStorage.getItem("userEmail") || "";
      const userPhone = localStorage.getItem("userPhone") || "";
      const userName = localStorage.getItem("userName") || "";

      // Step 3: Initialize Razorpay checkout
      const options = {
        key: "rzp_test_RhtYF7tlln3tsk", // Use environment variable for public key
        amount: amount,
        currency: "INR",
        name: "Console - craft",
        description: "Payment for your order",
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment on server
            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyResponse = await axios.post(
              "http://localhost:8000/api/v1/payment/verify-payment",
              paymentData,
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Fixed string interpolation
                },
                withCredentials: true,
              }
            );
            console.log("Cart Total Amount Before Payment:", cart.totalAmount);

            // Handle successful payment
            console.log("Payment Success:", verifyResponse.data);

            // Redirect to success page or show success message
            alert("Payment successful! Order has been placed.");

            // Clear cart or redirect to order confirmation page
            // You might want to navigate to an order confirmation page here
          } catch (err) {
            console.error("Payment Verification Error:", err);
            setError("Payment verification failed. Please contact support.");
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            setPaymentProcessing(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error("Payment Error:", err.response || err.message);
      setError(err.response?.data?.message || "Failed to process payment");
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl min-h-screen">
      <h1 className="text-4xl md:text-5xl special-font hero-heading font-black uppercase text-center mb-10 tracking-tight text-gray-900">
        Your C<b>a</b>rt
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100/90 text-red-800 rounded-xl border border-red-200/50 shadow-md transform transition-all duration-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex-center">
          <div className="three-body mx-auto">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      {!loading && cart.items.length === 0 ? (
        <div className="text-center text-gray-600 font-circular-web text-lg py-12">
          Your cart is empty
        </div>
      ) : (
        <div className="space-y-6">
          {cart.items
            .filter((item) => item.productId)
            .map((item) => (
              <div
                key={item.productId._id}
                className="cart-item flex items-center p-5 bg-black rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 border-hsla"
              >
                <img
                  src={
                    item.productId.imageUrl || "https://via.placeholder.com/100"
                  }
                  alt={item.productId.title}
                  className="w-24 h-24 object-cover rounded-xl mr-6 border border-gray-100"
                  onError={(e) =>
                    console.error("Image Load Error:", item.productId.imageUrl)
                  }
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold font-robert-medium text-blue-50">
                    {item.productId.title}
                  </h3>
                  <p className="text-blue-50 font-circular-web">
                    Price: ₹{item.price.toLocaleString()} × {item.quantity}
                  </p>
                  <p className="text-blue-50 font-medium font-robert-regular">
                    Subtotal: ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
                <Button
                  name={loading ? "Removing..." : "Remove"}
                  containerClass="bg-blue-50 md:flex hidden item-center justify-center gap-1"
                  onClick={() =>
                    !loading && handleRemoveFromCart(item.productId._id)
                  }
                />
              </div>
            ))}
          <div className="mt-8 p-6 bg-gray-50/90 rounded-2xl border border-gray-200 shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl md:text-3xl font-zentry font-black uppercase text-gray-900">
                Tot<b>a</b>l: ₹{cart.totalAmount.toLocaleString()}
              </h2>
              <div className="w-full md:w-auto md:ml-auto">
                <Button
                  name={
                    paymentProcessing ? "Processing..." : "Proceed To Pay"
                  }
                  containerClass="bg-blue-50 flex item-center justify-center gap-1"
                  onClick={handleProceedToPay}
                  disabled={
                    loading || paymentProcessing || cart.totalAmount <= 0
                  }
                />
              </div>
                
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
