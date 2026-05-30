import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Star, ThumbsUp, Send } from "lucide-react";

const QUICK_TAGS = [
  "Great driver", "On time", "Clean vehicle", "Safe driving",
  "Friendly", "Smooth ride", "Good navigation", "Professional",
];

export default function RatingReview() {
  const { state: ride } = useLocation();
  const navigate = useNavigate();

  const [rating,   setRating]   = useState(0);
  const [hover,    setHover]    = useState(0);
  const [tags,     setTags]     = useState([]);
  const [comment,  setComment]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [submitted,setSubmitted]= useState(false);

  const toggleTag = (tag) =>
    setTags((p) => p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag]);

  const submitRating = async () => {
    if (rating === 0) return toast.error("Please select a star rating");
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/ride/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rideId: ride?._id, rating, tags, comment }),
      });
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  const label = ["", "Terrible 😞", "Poor 😕", "Okay 😐", "Good 😊", "Excellent 🤩"][hover || rating] || "";

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 bg-[#F5C518]/10 rounded-full flex items-center justify-center mb-6 border-2 border-[#F5C518]/30">
          <ThumbsUp size={40} className="text-[#F5C518]" />
        </div>
        <h1 className="text-3xl font-extrabold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>Thank you!</h1>
        <p className="text-[#555] text-sm mb-8">Your feedback helps us improve</p>
        <div className="flex gap-1 mb-8">
          {[1,2,3,4,5].map((s) => (
            <Star key={s} size={32} className={s <= rating ? "text-[#F5C518]" : "text-[#333]"} fill={s <= rating ? "#F5C518" : "none"} />
          ))}
        </div>
        <button
          onClick={() => navigate("/home")}
          className="bg-[#F5C518] text-black font-bold px-8 py-3.5 rounded-xl hover:bg-yellow-400 active:scale-95 transition"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col px-4 pt-10 pb-8">
      <button onClick={() => navigate(-1)} className="text-[#666] hover:text-white transition text-sm mb-6">← Back</button>

      <p className="section-label">Feedback</p>
      <h1 className="text-3xl font-extrabold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>Rate your ride</h1>
      <p className="text-[#555] text-sm mb-8">How was your experience?</p>

      {/* Captain info */}
      {ride?.captain && (
        <div className="flex items-center gap-4 bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 mb-8">
          <div className="w-14 h-14 bg-[#F5C518] rounded-2xl flex items-center justify-center text-2xl">👨‍✈️</div>
          <div>
            <p className="font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
              {ride.captain?.fullname?.firstname} {ride.captain?.fullname?.lastname || ""}
            </p>
            <p className="text-[#555] text-sm capitalize">{ride.vehicleType} · {ride.captain?.vehicle?.plate}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[#F5C518] font-bold text-lg" style={{ fontFamily: "Syne, sans-serif" }}>₹{ride.fare}</p>
            <p className="text-[#555] text-xs">{ride.distance} km</p>
          </div>
        </div>
      )}

      {/* Star rating */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex gap-3 mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => setRating(s)}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                size={44}
                className={s <= (hover || rating) ? "text-[#F5C518]" : "text-[#2a2a2a]"}
                fill={s <= (hover || rating) ? "#F5C518" : "none"}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>
        <p className="text-[#888] text-sm h-5 transition-all">{label}</p>
      </div>

      {/* Quick tags */}
      {rating > 0 && (
        <div className="mb-6">
          <p className="text-xs text-[#555] uppercase tracking-widest font-semibold mb-3">What went well?</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  tags.includes(tag)
                    ? "bg-[#F5C518] text-black border-[#F5C518]"
                    : "bg-[#111] text-[#666] border-[#1e1e1e] hover:border-[#333]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comment */}
      {rating > 0 && (
        <div className="mb-8">
          <p className="text-xs text-[#555] uppercase tracking-widest font-semibold mb-2">Additional comments</p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about your ride..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-[#555] focus:outline-none focus:border-[#F5C518] resize-none text-sm"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          />
        </div>
      )}

      <button
        onClick={submitRating}
        disabled={loading || rating === 0}
        className="btn flex items-center justify-center gap-2 disabled:opacity-40"
      >
        <Send size={18} />
        {loading ? "Submitting..." : "Submit Review"}
      </button>

      <button onClick={() => navigate("/home")} className="btn-ghost mt-2">
        Skip for now
      </button>
    </div>
  );
}