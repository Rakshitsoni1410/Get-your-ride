import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Banknote,
  Smartphone,
  CreditCard,
  Tag,
  CheckCircle,
  ChevronRight,
  X,
} from "lucide-react";

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash", icon: Banknote, desc: "Pay driver directly" },
  { id: "upi", label: "UPI", icon: Smartphone, desc: "GPay, PhonePe, Paytm" },
  { id: "card", label: "Card", icon: CreditCard, desc: "Credit / Debit card" },
];

const PROMOS = {
  FIRST10: {
    discount: 10,
    type: "percent",
    desc: "10% off on your first ride",
  },
  RIDE50: { discount: 50, type: "flat", desc: "Flat ₹50 off" },
  SAVE20: { discount: 20, type: "percent", desc: "20% off today only" },
  WELCOME: { discount: 30, type: "flat", desc: "Welcome offer ₹30 off" },
};

export default function Payment() {
  const { state: ride } = useLocation();
  const navigate = useNavigate();
  const [method, setMethod] = useState("cash");
  const [upiId, setUpiId] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

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
    } else setPromoError("Invalid promo code");
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError("");
  };

  const handlePay = async () => {
    if (method === "upi" && !upiId.includes("@"))
      return toast.error("Enter a valid UPI ID");
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1800));
    setPaying(false);
    setPaid(true);
  };

  if (paid)
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
        style={{ background: "var(--bg-base)" }}
      >
        <div className="relative mb-8">
          <div
            className="absolute inset-0 w-28 h-28 rounded-full animate-ping"
            style={{ background: "rgba(34,197,94,0.1)" }}
          />
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center"
            style={{
              background: "var(--bg-card)",
              border: "2px solid rgba(34,197,94,0.4)",
            }}
          >
            <CheckCircle size={52} style={{ color: "#4ade80" }} />
          </div>
        </div>
        <h1
          className="text-3xl font-extrabold mb-2"
          style={{
            fontFamily: "Syne, sans-serif",
            color: "var(--text-primary)",
          }}
        >
          Payment Done!
        </h1>
        <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
          {method === "cash" ? "Please pay the driver ₹" : "₹"}
          {finalFare} paid via{" "}
          {PAYMENT_METHODS.find((m) => m.id === method)?.label}
        </p>
        <p
          className="text-4xl font-extrabold my-6"
          style={{ fontFamily: "Syne, sans-serif", color: "var(--accent)" }}
        >
          ₹{finalFare}
        </p>
        <button
          onClick={() => navigate("/ride/rate", { state: ride })}
          className="font-bold px-8 py-3.5 rounded-xl mb-3 transition active:scale-95 w-full max-w-xs"
          style={{
            fontFamily: "Syne, sans-serif",
            background: "var(--accent)",
            color: "var(--accent-text)",
          }}
        >
          Rate Your Ride ⭐
        </button>
        <button
          onClick={() => navigate("/home")}
          className="text-sm transition"
          style={{ color: "var(--text-muted)" }}
        >
          Go to Home
        </button>
      </div>
    );

  return (
    <div
      className="min-h-screen px-4 pt-10 pb-8 flex flex-col"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      <button
        onClick={() => navigate(-1)}
        className="transition text-sm mb-6"
        style={{ color: "var(--text-muted)" }}
      >
        ← Back
      </button>
      <p className="section-label">Checkout</p>
      <h1
        className="text-3xl font-extrabold mb-6"
        style={{ fontFamily: "Syne, sans-serif" }}
      >
        Payment
      </h1>

      {/* Ride summary */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <p
          className="text-xs uppercase tracking-widest font-semibold mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Ride Summary
        </p>
        <div className="flex gap-3 mb-3">
          <div className="flex flex-col items-center pt-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            <div
              className="w-px flex-1 my-1"
              style={{ background: "var(--border-input)" }}
            />
            <div
              className="w-2 h-2 rounded-sm"
              style={{ background: "var(--text-primary)" }}
            />
          </div>
          <div className="flex-1 space-y-2 min-w-0">
            <p
              className="text-sm truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              {ride?.pickup || "Pickup"}
            </p>
            <p
              className="text-sm truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              {ride?.destination || "Destination"}
            </p>
          </div>
        </div>
        <div
          className="flex justify-between text-sm pt-3"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <span style={{ color: "var(--text-muted)" }}>
            {ride?.distance} km · {ride?.vehicleType}
          </span>
          <span className="font-semibold">₹{baseFare}</span>
        </div>
      </div>

      {/* Promo code */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Tag size={16} style={{ color: "var(--accent)" }} />
          <p className="text-sm font-semibold">Promo Code</p>
        </div>
        {appliedPromo ? (
          <div
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <div>
              <p className="font-bold text-sm" style={{ color: "#4ade80" }}>
                {appliedPromo.code}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {appliedPromo.desc}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold" style={{ color: "#4ade80" }}>
                -₹{discount}
              </span>
              <button
                onClick={removePromo}
                className="transition"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value.toUpperCase());
                setPromoError("");
              }}
              placeholder="Enter code (try RIDE50)"
              className="flex-1 px-4 py-2.5 rounded-xl text-sm uppercase outline-none"
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-input)",
                color: "var(--text-primary)",
              }}
              onKeyDown={(e) => e.key === "Enter" && applyPromo()}
            />
            <button
              onClick={applyPromo}
              className="px-4 py-2.5 font-bold rounded-xl text-sm transition active:scale-95"
              style={{
                fontFamily: "Syne, sans-serif",
                background: "var(--accent)",
                color: "var(--accent-text)",
              }}
            >
              Apply
            </button>
          </div>
        )}
        {promoError && (
          <p className="text-red-400 text-xs mt-2">{promoError}</p>
        )}
        {!appliedPromo && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {Object.entries(PROMOS).map(([code]) => (
              <button
                key={code}
                onClick={() => {
                  setPromoInput(code);
                  setPromoError("");
                }}
                className="px-2.5 py-1 rounded-lg text-xs transition"
                style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-input)",
                  color: "var(--text-secondary)",
                }}
              >
                {code}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Payment methods */}
      <div className="mb-5">
        <p
          className="text-xs uppercase tracking-widest font-semibold mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Pay with
        </p>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((m) => {
            const Icon = m.icon;
            const active = method === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border transition-all"
                style={
                  active
                    ? {
                        background:
                          "color-mix(in srgb, var(--accent) 10%, transparent)",
                        borderColor:
                          "color-mix(in srgb, var(--accent) 40%, transparent)",
                      }
                    : {
                        background: "var(--bg-card)",
                        borderColor: "var(--border-subtle)",
                      }
                }
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: active
                      ? "color-mix(in srgb, var(--accent) 20%, transparent)"
                      : "var(--bg-input)",
                  }}
                >
                  <Icon
                    size={20}
                    style={{
                      color: active ? "var(--accent)" : "var(--text-secondary)",
                    }}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p
                    className="font-semibold text-sm"
                    style={{
                      color: active
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                    }}
                  >
                    {m.label}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {m.desc}
                  </p>
                </div>
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor: active
                      ? "var(--accent)"
                      : "var(--border-input)",
                  }}
                >
                  {active && (
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
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
      <div
        className="rounded-2xl p-4 mb-6"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div className="space-y-2 text-sm">
          <div
            className="flex justify-between"
            style={{ color: "var(--text-secondary)" }}
          >
            <span>Ride fare</span>
            <span>₹{baseFare}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between" style={{ color: "#4ade80" }}>
              <span>Promo ({appliedPromo.code})</span>
              <span>-₹{discount}</span>
            </div>
          )}
          <div
            className="flex justify-between font-bold text-base pt-2"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            <span>Total</span>
            <span
              style={{ fontFamily: "Syne, sans-serif", color: "var(--accent)" }}
            >
              ₹{finalFare}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={paying}
        className="btn flex items-center justify-center gap-2"
      >
        {paying ? (
          <>
            <div
              className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
              style={{
                borderColor: "var(--btn-text)",
                borderTopColor: "transparent",
              }}
            />{" "}
            Processing...
          </>
        ) : (
          <>
            {method === "cash" ? "Confirm Cash Payment" : `Pay ₹${finalFare}`}{" "}
            <ChevronRight size={18} />
          </>
        )}
      </button>
    </div>
  );
}
