"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/auth";
import { toast } from "sonner";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await apiCall("/api/reviews");
        if (response && Array.isArray(response)) {
          setReviews(response);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8">
      <h1
        className="text-[32px] font-semibold text-slate-900 tracking-tight mb-2"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Review Sessions
      </h1>
      <p className="text-[14px] text-slate-500 font-light mb-8">
        Track your spaced repetition and review progress
      </p>

      {reviews.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-slate-500">No reviews yet. Start reviewing your topics!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <h3 className="text-[16px] font-semibold text-slate-900 mb-2">
                {review.topicName}
              </h3>
              <p className="text-[13px] text-slate-600 mb-3">
                Status: <span className="font-semibold text-blue-600">{review.status}</span>
              </p>
              <p className="text-[12px] text-slate-500">
                Last reviewed: {review.lastReviewedDate ? new Date(review.lastReviewedDate).toLocaleDateString() : 'Never'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
