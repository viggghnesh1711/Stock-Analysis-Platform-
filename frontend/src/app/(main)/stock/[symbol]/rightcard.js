import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

function Rightcard({ setCompareMode, data, stocks }) {

  const { user, isSignedIn, isLoaded } = useUser();

  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const latest = data?.[data.length - 1];
  const prev = data?.[data.length - 2];

  const priceChange =
    latest && prev ? latest.close_price - prev.close_price : 0;

  const percentChange =
    latest && prev ? (priceChange / prev.close_price) * 100 : 0;

  const dayRange = latest
    ? latest.high_price - latest.low_price
    : 0;

  const last5 = data?.slice(-5);
  const sma5 =
    last5?.length
      ? last5.reduce((acc, item) => acc + item.close_price, 0) /
        last5.length
      : 0;

  useEffect(() => {
    if (!isLoaded) return;

    const checkWatchlist = async () => {
      if (!user || !stocks[0].id) return;

      const { data: existing, error } = await supabase
        .from("watchlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("stock_id", stocks[0].id)
        .limit(1);

      if (!error && existing && existing.length > 0) {
        setIsAdded(true);
      }
    };

    checkWatchlist();
  }, [user, stocks, isLoaded]);

  const handleToggleWatchlist = async () => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      toast.error("Login required");
      return;
    }

    if (!stocks[0].id) {
      toast.error("Stock not found");
      return;
    }

    setLoading(true);

    if (isAdded) {
      const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", user.id)
        .eq("stock_id", stocks[0].id);

      if (!error) {
        setIsAdded(false);
        toast.success("Removed from Watchlist ❌");
      } else {
        toast.error("Failed to remove");
        console.error(error);
      }

    } else {
      const { error } = await supabase
        .from("watchlist")
        .insert([
          {
            user_id: user.id, // 👈 Clerk user id
            stock_id: stocks[0].id,
          },
        ]);

      if (!error) {
        setIsAdded(true);
        toast.success("Added to Watchlist ✅");
      } else if (error.code === "23505") {
        setIsAdded(true);
        toast("Already in Watchlist ⚡");
      } else {
        toast.error("Failed to add");
        console.error(error);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={handleToggleWatchlist}
          disabled={loading}
          className={`
            flex-1 h-11 rounded-xl text-sm font-medium transition
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
            ${
              isAdded
                ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                : "bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25"
            }
          `}
        >
          {loading
            ? "Processing..."
            : isAdded
            ? "Added ✅"
            : "Add to Watchlist"}
        </button>

        <button
          onClick={() => setCompareMode(true)}
          className="
            flex-1 h-11 rounded-xl
            text-sm
            bg-stone-800/60 text-zinc-300
            hover:bg-stone-800
            transition
          "
        >
          Compare Range
        </button>
      </div>

      {/* 📊 Overview */}
      <div className="mt-5">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-5">
          Yesterday’s Overview
        </p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          <Stat label="Open" value={latest?.open_price?.toFixed(2)} />
          <Stat label="High" value={latest?.high_price?.toFixed(2)} />
          <Stat label="Low" value={latest?.low_price?.toFixed(2)} />
          <Stat label="Close" value={latest?.close_price?.toFixed(2)} />
        </div>
      </div>

      {/* 📈 Insights */}
      <div className="mt-5">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-5">
          Insights
        </p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          <Stat
            label="Price Change"
            value={`${priceChange.toFixed(2)} (${percentChange.toFixed(2)}%)`}
          />
          <Stat label="Day Range" value={dayRange.toFixed(2)} />
          <Stat label="5-Day Avg" value={sma5.toFixed(2)} />
          <Stat
            label="Trend"
            value={percentChange > 0 ? "Bullish 📈" : "Bearish 📉"}
          />
        </div>
      </div>
    </>
  );
}

export default Rightcard;

function Stat({ label, value }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-base font-medium text-zinc-100">
        {value ?? "-"}
      </span>
    </div>
  );
}