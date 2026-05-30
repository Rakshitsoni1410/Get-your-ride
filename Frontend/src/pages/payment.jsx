import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Banknote, Smartphone, CreditCard, Tag, CheckCircle, ChevronRight, X } from "lucide-react";

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash",    icon: Banknote,    desc: "Pay driver directly" },
  { id: "upi",  label: "UPI",     icon: Smartphone,  desc: "GPay, PhonePe, Paytm" },
  { id: "card", label: "Card",    icon: CreditCard,  desc: "Credit / Debit card" },
];

const PROMOS = {
  "FIRST10":  { discount: 10, type: "percent", desc: "10% off on your first ride" },
  "RIDE50":   { discount: 50, type: "flat",    desc: "Flat ₹50 off" },
  "SAVE20":   { discount: 20, type: "percent", desc: "20% off today only" },
  "WELCOME":  { discount: 30, type: "flat",    desc: "Welcome offer ₹30 off" },
};

export default function Payment() {
  const { state: ride } = useLocation();
  const navigate = useNavigate();

  const [method,      setMethod]      = useState("cash");
  const [upiId,       setUpiId]       = useState("");
  const [promoInput,  setPromoInput]  = useState("");
  const [appliedPromo,setAppliedPromo]= useState(null);
  const [promoError,  setPromoError]  = useState("");
  const [paying,      setPaying]      = useState(false);
  const [paid,        setPaid]        = useState(false);

  const baseFare = ride?.fare || 0;

  const discount = appliedPromo
    ? appliedPromo.type === "flat"
      ? Math.min(appliedPromo.discount, baseFare)
      : Math.round((baseFare * appliedPromo.discount) / 100)
    : 0;

  const finalFare = Math.max(baseFare - discount, 0);

  const applyPromo = () => {
    setPromoError("");
    const code = promoInput.trim().toUpperCase();
    if (!code) return setPromoError("Enter a promo code");
    if (PROMOS[code]) {
      setAppliedPromo({ ...PROMOS[code], code });
      toast.success(`Promo applied! ${PROMOS[code].desc} 🎉`);
    } else {
      setPromoError("Invalid promo code");
    }
  };

  const removePromo = () => { setAppliedPromo(null); setPromoInput(""); setPromoError(""); };

  const handlePay = async () => {
    if (method === "upi" && !upiId.includes("@")) return toast.error("Enter a valid UPI ID");
    setPaying(true);
    // Simulate payment
    await new Promise((r) => setTimeout(r, 1800));
    setPaying(false);
    setPaid(true);
  };

  if (paid) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 w-28 h-28 rounded-full bg-green-500/10 animate-ping" />
          <div className="relative w-28 h-28 rounded-full bg-[#111] border-2 border-green-500/40 flex items-center justify-center">
            <CheckCircle size={52} className="text-green-400" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>Payment Done!</h1>
        <p className="text-[#555] text-sm mb-2">
          {method === "cash" ? "Please pay the driver ₹" : "₹"}{finalFare} paid via {PAYMENT_METHODS.find(m => m.id === method)?.label}
        </p>
        <p className="text-4xl font-extrabold text-[#F5C518] my-6" style={{ fontFamily: "Syne, sans-serif" }}>₹{finalFare}</p>
        <button
          onClick={() => navigate("/ride/rate", { state: ride })}
          className="bg-[#F5C518] text-black font-bold px-8 py-3.5 rounded-xl mb-3 hover:bg-yellow-400 active:scale-95 transition w-full max-w-xs"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Rate Your Ride ⭐
        </button>
        <button onClick={() => navigate("/home")} className="text-[#555] hover:text-white text-sm transition">
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 pt-10 pb-8 flex flex-col">
      <button onClick={() => navigate(-1)} className="text-[#666] hover:text-white transition text-sm mb-6">← Back</button>

      <p className="section-label">Checkout</p>
      <h1 className="text-3xl font-extrabold mb-6" style={{ fontFamily: "Syne, sans-serif" }}>Payment</h1>

      {/* Ride summary */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 mb-5">
        <p className="text-xs text-[#555] uppercase tracking-widest font-semibold mb-3">Ride Summary</p>
        <div className="flex gap-3 mb-3">
          <div className="flex flex-col items-center pt-1">
            <div className="w-2 h-2 rounded-full bg-[#F5C518]" />
            <div className="w-px flex-1 bg-[#2a2a2a] my-1" />
            <div className="w-2 h-2 rounded-sm bg-white" />
          </div>
          <div className="flex-1 space-y-2 min-w-0">
            <p className="text-sm text-[#ccc] truncate">{ride?.pickup || "Pickup"}</p>
            <p className="text-sm text-[#ccc] truncate">{ride?.destination || "Destination"}</p>
          </div>
        </div>
        <div className="flex justify-between text-sm pt-3 border-t border-[#1a1a1a]">
          <span className="text-[#555]">{ride?.distance} km · {ride?.vehicleType}</span>
          <span className="text-white font-semibold">₹{baseFare}</span>
        </div>
      </div>

      {/* Promo code */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Tag size={16} className="text-[#F5C518]" />
          <p className="text-sm font-semibold">Promo Code</p>
        </div>

        {appliedPromo ? (
          <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
            <div>
              <p className="text-green-400 font-bold text-sm">{appliedPromo.code}</p>
              <p className="text-[#555] text-xs">{appliedPromo.desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-400 font-bold">-₹{discount}</span>
              <button onClick={removePromo} className="text-[#555] hover:text-red-400 transition">
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={promoInput}
              onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
              placeholder="Enter code (try RIDE50)"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-[#555] focus:outline-none focus:border-[#F5C518] text-sm uppercase"
              onKeyDown={(e) => e.key === "Enter" && applyPromo()}
            />
            <button
              onClick={applyPromo}
              className="px-4 py-2.5 bg-[#F5C518] text-black font-bold rounded-xl text-sm hover:bg-yellow-400 active:scale-95 transition"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Apply
            </button>
          </div>
        )}
        {promoError && <p className="text-red-400 text-xs mt-2">{promoError}</p>}

        {/* Available promos hint */}
        {!appliedPromo && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {Object.entries(PROMOS).map(([code, p]) => (
              <button
                key={code}
                onClick={() => { setPromoInput(code); setPromoError(""); }}
                className="px-2.5 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs text-[#666] hover:text-[#F5C518] hover:border-[#F5C518] transition"
              >
                {code}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Payment methods */}
      <div className="mb-5">
        <p className="text-xs text-[#555] uppercase tracking-widest font-semibold mb-3">Pay with</p>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((m) => {
            const Icon = m.icon;
            const active = method === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  active ? "bg-[#F5C518]/10 border-[#F5C518]/40" : "bg-[#111] border-[#1e1e1e] hover:border-[#2a2a2a]"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? "bg-[#F5C518]/20" : "bg-[#1a1a1a]"}`}>
                  <Icon size={20} className={active ? "text-[#F5C518]" : "text-[#666]"} />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-semibold text-sm ${active ? "text-white" : "text-[#888]"}`}>{m.label}</p>
                  <p className="text-[#555] text-xs">{m.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? "border-[#F5C518]" : "border-[#333]"}`}>
                  {active && <div className="w-2.5 h-2.5 rounded-full bg-[#F5C518]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* UPI ID input */}
        {method === "upi" && (
          <input
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="yourname@upi"
            className="input mt-3"
          />
        )}
      </div>

      {/* Fare breakdown */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 mb-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-[#666]">
            <span>Ride fare</span><span>₹{baseFare}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-400">
              <span>Promo ({appliedPromo.code})</span><span>-₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-[#1a1a1a]">
            <span>Total</span>
            <span className="text-[#F5C518]" style={{ fontFamily: "Syne, sans-serif" }}>₹{finalFare}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={paying}
        className="btn flex items-center justify-center gap-2"
      >
        {paying ? (
          <><div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> Processing...</>
        ) : (
          <>{method === "cash" ? "Confirm Cash Payment" : `Pay ₹${finalFare}`} <ChevronRight size={18} /></>
        )}
      </button>
    </div>
  );
}