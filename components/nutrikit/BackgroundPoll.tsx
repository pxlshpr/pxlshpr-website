"use client";

import { useState, useEffect } from "react";

type BackgroundType = "none" | "particles" | "lava" | "crt" | "glow" | "mesh";

interface VoteData {
  userChoice: BackgroundType | null;
}

const options: { value: BackgroundType; label: string; desc: string }[] = [
  { value: "none", label: "None", desc: "Solid background only" },
  { value: "particles", label: "Particles", desc: "Floating dots" },
  { value: "lava", label: "Lava Lamp", desc: "Gooey metaballs" },
  { value: "crt", label: "CRT", desc: "Retro scanlines" },
  { value: "glow", label: "Glow", desc: "Spinning conic" },
  { value: "mesh", label: "Mesh", desc: "Original gradient" },
];

interface BackgroundPollProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BackgroundPoll({ isOpen, onClose }: BackgroundPollProps) {
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchVotes();
    }
  }, [isOpen]);

  async function fetchVotes() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/vote");
      const data = await res.json();

      // Check for error in response
      if (data.error) {
        console.error("API Error:", data.error);
        setVoteData({ userChoice: null });
      } else {
        setVoteData({ userChoice: data.userChoice });
        setHasVoted(!!data.userChoice);
      }
    } catch (error) {
      console.error("Failed to fetch votes:", error);
      setVoteData({ userChoice: null });
    } finally {
      setIsLoading(false);
    }
  }

  async function submitVote(choice: BackgroundType) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice }),
      });
      const data = await res.json();
      if (data.success) {
        setVoteData({ userChoice: choice });
        setHasVoted(true);
      }
    } catch (error) {
      console.error("Failed to submit vote:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold gradient-text-accent">
              Vote for Your Favorite Background
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-muted mt-1">
            {hasVoted ? "Thanks for voting!" : "Click on your favorite to cast your vote."}
            {voteData?.userChoice && (
              <span className="block mt-1 text-accent">
                You can change your vote anytime.
              </span>
            )}
          </p>
        </div>

        {/* Options */}
        <div className="px-6 py-4 space-y-2">
          {isLoading ? (
            <div className="py-8 text-center text-muted">
              <div className="inline-block w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              <p className="mt-2 text-sm">Loading poll...</p>
            </div>
          ) : (
            options.map((option) => {
              const isUserChoice = voteData?.userChoice === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => submitVote(option.value)}
                  disabled={isSubmitting}
                  className={`w-full relative overflow-hidden rounded-xl transition-all duration-200 ${
                    isUserChoice
                      ? "ring-2 ring-accent bg-gradient-to-r from-accent/15 to-accent/5 dark:bg-accent/10"
                      : "hover:bg-black/5 dark:hover:bg-white/5"
                  } ${isSubmitting ? "opacity-50 cursor-wait" : ""} border border-transparent ${
                    isUserChoice ? "border-accent/30 dark:border-accent/30" : "border-black/10 dark:border-white/10"
                  }`}
                >
                  {/* Content */}
                  <div className="relative px-4 py-3 flex items-center">
                    <div className={`flex items-center flex-1 ${isUserChoice ? "gap-2" : ""}`}>
                      {isUserChoice && (
                        <div className="w-6 h-6 rounded-full bg-slate-800 dark:bg-accent flex items-center justify-center animate-in fade-in scale-in-50 duration-200 flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <div className="text-left">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted">{option.desc}</div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
