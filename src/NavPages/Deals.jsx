import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";

gsap.registerPlugin(ScrollTrigger);

export default function DealsSection({ sectioncategory = "Games" }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const dealRefs = useRef([]);
  const counterRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deals, setDeals] = useState([
    {
      title: "Premium Headphones",
      originalPrice: 299.99,
      discountedPrice: 199.99,
      discount: 33,
      image: "/placeholder.svg?height=200&width=200",
      badge: "Best Seller",
      color: "from-orange-900/20 to-orange-700/20",
      badgeColor: "bg-orange-500",
    },
    {
      title: "Smart Watch Series 5",
      originalPrice: 399.99,
      discountedPrice: 299.99,
      discount: 25,
      image: "/placeholder.svg?height=200&width=200",
      badge: "Limited",
      color: "from-blue-900/20 to-blue-700/20",
      badgeColor: "bg-blue-500",
    },
    {
      title: "Wireless Earbuds",
      originalPrice: 149.99,
      discountedPrice: 89.99,
      discount: 40,
      image: "/placeholder.svg?height=200&width=200",
      badge: "Hot Deal",
      color: "from-red-900/20 to-red-700/20",
      badgeColor: "bg-red-500",
    },
    {
      title: '4K Smart TV 55"',
      originalPrice: 899.99,
      discountedPrice: 699.99,
      discount: 22,
      image: "/placeholder.svg?height=200&width=200",
      badge: "New",
      color: "from-green-900/20 to-green-700/20",
      badgeColor: "bg-green-500",
    },
  ]);

  // Fetch images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/image/getImageByCategory`, {
          params: { category: sectioncategory, page: 1, limit: 10 },
        });
        const fetchedImages = response.data.data || [];
        if (fetchedImages.length) {
          setDeals((prev) =>
            prev.map((deal, i) => ({
              ...deal,
              image: fetchedImages[i]?.imageUrl || deal.image,
            }))
          );
        }
      } catch {
        setError("Failed to load images.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, [sectioncategory]);

  // GSAP animations and countdown
  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { backgroundColor: "rgba(9, 9, 11, 0)" },
      { backgroundColor: "rgba(9, 9, 11, 1)", duration: 1.5, scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "top 20%", scrub: true } }
    );
    gsap.fromTo(
      titleRef.current,
      { y: 50, opacity: 0, textShadow: "0 0 0px rgba(234, 88, 12, 0)" },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", textShadow: "0 0 15px rgba(234, 88, 12, 0.5)", scrollTrigger: { trigger: titleRef.current, start: "top 90%" } }
    );
    if (dealRefs.current.length) {
      gsap.fromTo(
        dealRefs.current,
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.15, duration: 0.8, ease: "back.out(1.7)", boxShadow: "0 0 20px rgba(234, 88, 12, 0.2)", scrollTrigger: { trigger: dealRefs.current[0], start: "top 85%" } }
      );
    }

    const endTime = new Date(new Date().setHours(new Date().getHours() + 24));
    const updateCounter = () => {
      const diff = endTime - new Date();
      if (diff <= 0 || !counterRef.current) return;
      const hours = Math.floor(diff / 3600000).toString().padStart(2, "0");
      const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
      counterRef.current.textContent = `${hours}:${minutes}:${seconds}`;
    };
    const interval = setInterval(updateCounter, 1000);
    updateCounter();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      clearInterval(interval);
    };
  }, []);

  const addToRefs = useCallback((el) => {
    if (el && !dealRefs.current.includes(el)) dealRefs.current.push(el);
  }, []);

  const buttonStyles = "w-full px-4 py-2 sm:py-3 rounded-full bg-gradient-to-r from-orange-600 to-red-500 text-white font-bold hover:shadow-[0_0_20px_rgba(234,88,12,0.5)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 text-sm sm:text-base";

  return (
    <section ref={sectionRef} className="min-h-screen bg-zinc-950 text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative" role="region" aria-label="Deals Section">
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-orange-600/20 rounded-full blur-[120px] hidden sm:block" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-red-600/20 rounded-full blur-[120px] hidden sm:block" />
      <div className="max-w-7xl mx-auto">
        {isLoading && <div className="text-center text-zinc-400 mb-8" role="alert">Loading deals...</div>}
        {error && <div className="text-center text-red-500 mb-8" role="alert">{error}</div>}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10m0 0v10m0-10l-7 7" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Flash Deals</span>
            </div>
          </div>
          <h2 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-400">
            Today's Special Offers
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto mb-6 sm:mb-8">
            Don't miss out on these incredible deals! Limited time offers on premium products with huge discounts.
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <div className="flex items-center gap-2 text-orange-400">
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Ends in:</span>
            </div>
            <div ref={counterRef} className="text-lg sm:text-2xl font-bold px-3 sm:px-4 py-1 sm:py-2 bg-zinc-900 rounded-lg border border-orange-500/20">
              24:00:00
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12">
          {deals.map((deal) => (
            <div
              key={deal.title}
              ref={addToRefs}
              className={`p-4 sm:p-6 rounded-2xl bg-gradient-to-br ${deal.color} backdrop-blur-sm border border-white/10 hover:border-orange-500/50 transition-all duration-300 group relative`}
              role="article"
              aria-labelledby={`deal-title-${deal.title}`}
            >
              <div className={`absolute top-3 right-3 ${deal.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full`}>{deal.badge}</div>
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>{deal.discount}% OFF</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-full h-40 sm:h-48 mb-4 overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-300">
                  <img src={deal.image || "/img/about.webp"} alt={deal.title} className="w-full h-full object-cover" loading="lazy" onError={(e) => (e.target.src = "/img/about.webp")} />
                </div>
                <h3 id={`deal-title-${deal.title}`} className="text-lg sm:text-xl font-bold mb-2 text-white group-hover:text-orange-400 transition-colors duration-300">
                  {deal.title}
                </h3>
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <span className="text-zinc-400 text-sm sm:text-base line-through">${deal.originalPrice}</span>
                  <span className="text-xl sm:text-2xl font-bold text-orange-500">${deal.discountedPrice}</span>
                </div>
                <button className={buttonStyles} aria-label={`Add ${deal.title} to cart`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        <div
          ref={addToRefs}
          className="mt-12 sm:mt-20 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 border border-white/10 relative overflow-hidden group"
          role="complementary"
          aria-label="VIP Membership"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 sm:w-6 h-5 sm:h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-orange-400 text-sm sm:text-base font-medium">Premium Membership</span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-white">Get Exclusive Access to VIP Deals</h3>
              <p className="text-zinc-400 text-sm sm:text-base mb-4 sm:mb-6 max-w-xl">
                Sign up for our premium membership and receive early access to flash sales, additional discounts, and free shipping on all orders.
              </p>
              <button className={buttonStyles.replace("w-full", "px-6 sm:px-8")} aria-label="Join VIP Club">
                Join VIP Club
              </button>
            </div>
            <div className="w-full md:w-1/3 aspect-square rounded-xl overflow-hidden border-2 border-orange-500/30">
              <img src="/img/about.webp" alt="VIP membership" className="w-full h-full object-cover" loading="lazy" onError={(e) => (e.target.src = "/img/about.webp")} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}