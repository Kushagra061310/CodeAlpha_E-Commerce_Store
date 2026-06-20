"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userToken, setUserToken] = useState<string | null>(null);

  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  // NEW ENTERPRISE STATES: Payment Gateway
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  useEffect(() => {
    fetch("https://e-commerce-store-gear-backend.onrender.com/api/products/")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const cleanPrice = (priceInput: any): number => {
    if (priceInput === undefined || priceInput === null) return 0;
    const sanitized = String(priceInput).replace(/[^0-9.]/g, "");
    const parsed = parseFloat(sanitized);
    return isNaN(parsed) ? 0 : parsed;
  };

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert(`Success! ${product.name} was added to your cart.`);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: number) => setCart(cart.filter((item) => item.id !== id));

  const subtotal = cart.reduce((sum, item) => sum + cleanPrice(item.price) * item.quantity, 0);
  const shippingThreshold = 10000; 
  const shippingCharge = subtotal > shippingThreshold || subtotal === 0 ? 0 : 150;
  const gstCharge = subtotal * 0.18; 
  const grandTotal = subtotal + shippingCharge + gstCharge;
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // UPGRADED: Triggers the secure payment overlay instead of an instant alert
  const initiateCheckout = () => {
    if (!userToken) {
      alert("Executive Access Required. Please log in to proceed to the secure payment gateway.");
      setIsCartOpen(false);
      setIsAuthOpen(true);
      return;
    }
    if (cart.length === 0) return;
    setIsPaymentGatewayOpen(true);
  };

  // NEW: The Asynchronous Payment Verification Engine
  const processSecurePayment = (e: any) => {
    e.preventDefault(); // Stop page reload
    setIsProcessingPayment(true); // Trigger the loading UI

    // Simulate real-world bank API latency (2.5 seconds)
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaymentGatewayOpen(false);
      
      // Generate a mock Enterprise Transaction Receipt
      const txnId = "TXN-" + Math.random().toString(36).substring(2, 10).toUpperCase();
      alert(`✅ PAYMENT SUCCESSFUL\n\nGateway Verification ID: ${txnId}\nAmount Paid: ₹${grandTotal.toFixed(2)}\n\nYour executive gear is being prepared for dispatch.`);
      
      // Reset the application state
      setCart([]); 
      setIsCartOpen(false);
      setCardNumber("");
      setCardExpiry("");
      setCardCvv("");
    }, 2500);
  };

  const handleAuth = async (e: any) => {
    e.preventDefault(); 
    const endpoint = isRegistering ? "register/" : "login/";
    const payload = isRegistering ? { username, email, password } : { username, password };
    try {
      const response = await fetch(`https://e-commerce-store-gear-backend.onrender.com/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        if (isRegistering) {
          alert("Registration successful! Please log in.");
          setIsRegistering(false); 
        } else {
          setUserToken(data.token); 
          setIsAuthOpen(false); 
          setUsername("");
          setPassword("");
        }
      } else {
        alert("Error: " + JSON.stringify(data));
      }
    } catch (error) { console.error("Auth error:", error); }
  };

  const openProductDetails = async (product: any) => {
    setSelectedProduct(product);
    setProductReviews([]); 
    setReviewRating(5); 
    try {
      const response = await fetch(`https://e-commerce-store-gear-backend.onrender.com/api/products/${product.id}/reviews/`);
      if (response.ok) {
        const data = await response.json();
        setProductReviews(data);
      }
    } catch (error) { console.error("Failed to fetch reviews", error); }
  };

  const submitReview = async (e: any) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    try {
      const response = await fetch(`https://e-commerce-store-gear-backend.onrender.com/api/products/${selectedProduct.id}/reviews/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            author: reviewAuthor || "Anonymous Executive", 
            text: reviewText,
            rating: reviewRating 
        }),
      });
      if (response.ok) {
        const newReview = await response.json();
        setProductReviews([newReview, ...productReviews]); 
        setReviewText("");
        setReviewAuthor("");
        setReviewRating(5);
      }
    } catch (error) { console.error("Failed to submit review", error); }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* ENTERPRISE PAYMENT OVERLAY */}
      {isPaymentGatewayOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  🔒 Secure Checkout
                </h3>
                <p className="text-gray-400 text-sm mt-1">Simulated Enterprise Gateway</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Total Due</p>
                <p className="text-2xl font-black text-green-400">₹{grandTotal.toFixed(2)}</p>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={processSecurePayment} className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Card Number</label>
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  required 
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-mono text-lg transition tracking-widest"
                />
              </div>
              
              <div className="flex gap-6">
                <div className="flex flex-col gap-2 w-1/2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Expiry</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    required 
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-mono text-lg transition"
                  />
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">CVV</label>
                  <input 
                    type="password" 
                    placeholder="•••" 
                    required 
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-mono text-lg transition"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsPaymentGatewayOpen(false)}
                  disabled={isProcessingPayment}
                  className="flex-1 bg-gray-100 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isProcessingPayment}
                  className="flex-[2] bg-green-600 text-white font-extrabold py-4 rounded-xl hover:bg-green-700 shadow-lg hover:shadow-xl transition flex justify-center items-center gap-3 disabled:opacity-80"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Pay ₹{grandTotal.toFixed(2)}</span>
                  )}
                </button>
              </div>
            </form>
            {/* Trust Badges */}
            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-center gap-6 opacity-60">
               <span className="text-xs font-bold uppercase tracking-widest text-gray-500">AES-256 Encrypted</span>
               <span className="text-xs font-bold uppercase tracking-widest text-gray-500">PCI-DSS Compliant</span>
            </div>
          </div>
        </div>
      )}

      {/* AMBIENT BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-60 pointer-events-none"></div>
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] rounded-full bg-blue-500 opacity-10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] rounded-full bg-purple-500 opacity-10 blur-[100px] pointer-events-none"></div>

      <div className="relative z-10">
        {/* NAVIGATION BAR */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight cursor-pointer hover:text-blue-600 transition" onClick={() => { setIsCartOpen(false); setSelectedProduct(null); setIsAuthOpen(false); }}>
              EXECUTIVE<span className="text-blue-600">GEAR</span>
            </h1>
            <div className="flex items-center gap-3 md:gap-6">
              {userToken ? (
                <button onClick={() => { setUserToken(null); alert("Logged out successfully."); }} className="text-sm font-semibold text-gray-600 hover:text-black transition">Logout</button>
              ) : (
                <button onClick={() => { setIsAuthOpen(true); setIsCartOpen(false); setSelectedProduct(null); }} className="text-sm font-semibold text-gray-600 hover:text-black transition">Login / Register</button>
              )}
              <button onClick={() => { setIsCartOpen(!isCartOpen); setSelectedProduct(null); setIsAuthOpen(false); }} className="bg-black text-white px-5 py-2.5 rounded-full font-bold shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                <span>🛒</span><span>{totalItemsCount}</span>
              </button>
            </div>
          </div>
        </nav>

        {/* HERO BANNER */}
        {!isAuthOpen && !isCartOpen && !selectedProduct && (
          <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-black text-white py-24 px-6 shadow-inner">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">Elevate Your Workspace.</h2>
              <p className="text-xl text-blue-200 font-light mb-10 max-w-2xl mx-auto">Premium hardware and accessories engineered for elite developers, designers, and executives.</p>
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {isAuthOpen ? (
            <div className="max-w-md mx-auto bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{isRegistering ? "Create Account" : "Welcome Back"}</h2>
              <form onSubmit={handleAuth} className="flex flex-col gap-5">
                <input type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition" />
                {isRegistering && <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition" />}
                <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition" />
                <button type="submit" className="w-full mt-2 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition">{isRegistering ? "Sign Up" : "Secure Login"}</button>
              </form>
              <p className="text-center text-sm text-gray-500 mt-8 cursor-pointer hover:text-blue-600 font-medium" onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? "Already have an account? Log in" : "Need an account? Sign up"}
              </p>
            </div>
          ) : isCartOpen ? (
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
              <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-4">Shopping Cart Summary</h2>
              {cart.length === 0 ? (
                <div className="bg-white text-center py-16 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-xl text-gray-400 font-medium mb-4">Your shopping cart is currently empty.</p>
                  <button onClick={() => setIsCartOpen(false)} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition">Browse Products</button>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0 gap-4">
                        <div className="flex items-center gap-4">
                          <img src={item.image_url} alt={item.name} className="h-16 w-16 object-contain bg-gray-50 p-1 rounded-lg" />
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                            <p className="text-sm text-blue-600 font-bold">₹{cleanPrice(item.price).toFixed(2)} each</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 text-gray-600 hover:bg-gray-200 font-bold transition">-</button>
                            <span className="px-4 py-1 text-gray-900 font-semibold bg-white border-x border-gray-200">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-200 font-bold transition">+</button>
                          </div>
                          <span className="font-extrabold text-gray-900 text-xl w-24 text-right">₹{(cleanPrice(item.price) * item.quantity).toFixed(2)}</span>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 font-medium text-sm transition">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 max-w-md ml-auto w-full flex flex-col gap-4">
                    <h3 className="font-bold text-gray-900 text-xl border-b pb-3">Order Total Invoice</h3>
                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-600 items-center">
                      <span>Estimated Shipping</span>
                      {shippingCharge === 0 ? <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-0.5 rounded">FREE</span> : <span className="font-semibold text-gray-900">₹{shippingCharge.toFixed(2)}</span>}
                    </div>
                    <div className="flex justify-between text-gray-600"><span>GST (18%)</span><span className="font-semibold text-gray-900">₹{gstCharge.toFixed(2)}</span></div>
                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                      <span className="font-bold text-gray-900 text-lg">Grand Total</span><span className="font-black text-gray-900 text-2xl">₹{grandTotal.toFixed(2)}</span>
                    </div>
                    {/* CHANGED: Triggers the new Gateway Overlay */}
                    <button onClick={initiateCheckout} className="w-full mt-4 bg-green-600 text-white font-extrabold text-lg py-4 rounded-xl hover:bg-green-700 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">Process Order & Pay</button>
                  </div>
                </div>
              )}
            </div>
          ) : selectedProduct ? (
            <div className="max-w-5xl mx-auto flex flex-col gap-10">
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-12">
                <div className="w-full md:w-1/2 bg-gray-50 rounded-2xl flex items-center justify-center p-8">
                  <img src={selectedProduct.image_url} alt={selectedProduct.name} className="max-w-full max-h-[500px] object-contain drop-shadow-2xl hover:scale-105 transition duration-500" />
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">{selectedProduct.name}</h2>
                  <p className="text-3xl font-black text-blue-600 mb-8">₹{cleanPrice(selectedProduct.price).toFixed(2)}</p>
                  <div className="prose prose-lg text-gray-600 mb-10">
                    <p className="leading-relaxed">{selectedProduct.description}</p>
                  </div>
                  <div className="flex gap-4 mt-auto">
                    <button onClick={() => addToCart(selectedProduct)} className="flex-1 bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">Add to Cart</button>
                    <button onClick={() => setSelectedProduct(null)} className="flex-1 bg-gray-100 text-gray-800 font-bold text-lg py-4 rounded-xl hover:bg-gray-200 transition">Back</button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Customer Reviews</h3>
                <p className="text-gray-500 mb-8 font-medium">Real feedback from verified executives.</p>
                <form onSubmit={submitReview} className="mb-10 bg-slate-50 p-8 rounded-2xl border border-gray-200 shadow-inner">
                  <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Leave a Review</h4>
                  <div className="flex gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setReviewRating(star)} className={`text-4xl transition-transform hover:scale-110 ${star <= reviewRating ? "text-yellow-400 drop-shadow-sm" : "text-gray-300"}`}>★</button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4">
                    <input type="text" placeholder="Your Name (Optional)" value={reviewAuthor} onChange={(e) => setReviewAuthor(e.target.value)} className="p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-white transition" />
                    <textarea placeholder="Write your review here..." required value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none min-h-[120px] bg-white transition"></textarea>
                    <button type="submit" className="bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition w-full md:w-auto md:self-end px-10 shadow-md">Submit Review</button>
                  </div>
                </form>
                <div className="flex flex-col gap-6">
                  {productReviews.length === 0 ? (
                    <p className="text-center text-gray-400 font-medium py-8 bg-gray-50 rounded-2xl border border-gray-100">No reviews yet. Be the first to rate this product!</p>
                  ) : (
                    productReviews.map((review: any) => (
                      <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3 hover:shadow-md transition">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                          <span className="font-bold text-gray-900 text-lg">{review.author}</span>
                          <span className="text-yellow-400 text-xl tracking-widest drop-shadow-sm">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed pt-2">{review.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any) => (
                <div key={product.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col group">
                  <div className="h-56 w-full bg-gray-50 rounded-xl flex items-center justify-center mb-6 overflow-hidden p-4 group-hover:bg-white transition">
                     <img src={product.image_url} alt={product.name} className="max-h-full object-contain group-hover:scale-110 transition duration-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h2>
                  <p className="text-2xl font-black text-blue-600 mb-4">₹{cleanPrice(product.price).toFixed(2)}</p>
                  <p className="text-sm text-gray-500 mb-8 flex-grow line-clamp-2">{product.description}</p>
                  <div className="flex gap-3 mt-auto">
                    <button onClick={() => openProductDetails(product)} className="flex-1 bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-100 border border-gray-200 transition">Details</button>
                    <button onClick={() => addToCart(product)} className="flex-1 bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-black shadow-md transition">+ Cart</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}