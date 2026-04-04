"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import StockHeader from "./StockHeader";
import StockChart from "./StockChart";
import RangeSelector from "./RangeSelector";
import Header from "./Header";
import StockSnapshot from "./StockSnapshot";
import Searchbar from "@/components/Searchbar";
import { motion } from "framer-motion"
import Loader from "@/components/Loader";


export default function Page() {
  const { symbol } = useParams();

  const [data, setData] = useState(null);
  const [details, setDetails] = useState([]);
  const [prices, setPrices] = useState([]);
  const [range, setRange] = useState("MAX");

  const [compareMode, setCompareMode] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);

  const fetched = useRef(false);

  useEffect(() => {
    if (!symbol) return;
    if (fetched.current) return;

    fetched.current = true;

    const fetchStock = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/StockName?symbol=${symbol}`, //first time fetching with the max data
      );
      const data = await res.json();
      setDetails(data.stockdetails);
      setPrices(data.prices);
      setData(data.status);
    };

    fetchStock();
  }, [symbol]);

  useEffect(() => {
    if (!symbol || !range) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/StockRange?symbol=${symbol}&range=${range}`, // after range is changed
        );

        if (!res.ok) {
          throw new Error("Failed to fetch chart data");
        }

        const data = await res.json();
        setPrices(data.prices);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, [symbol, range]);

  let start = null;
  let end = null;

  if (dragStart && dragEnd) {
    start = dragStart < dragEnd ? dragStart : dragEnd;
    end = dragStart < dragEnd ? dragEnd : dragStart;
  }

  useEffect(() => {
    if (!compareMode) {
      setDragStart(null);
      setDragEnd(null);
    }
  }, [compareMode]);

  const isSelecting = compareMode && dragStart && !dragEnd;
  const isComplete = compareMode && dragStart && dragEnd;

  if (!data) return <Loader/>

 return (
    <div className="w-full min-h-screen flex flex-col">

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full"
      >
        <Header />
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="w-full py-6 md:hidden"
      >
        <Searchbar/>
      </motion.div>

      <div className="w-full flex flex-col lg:flex-row lg:h-[90%] gap-6 lg:gap-10 px-4 lg:px-0 mt-4 lg:mt-6">

        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="w-full lg:w-[65%] flex flex-col lg:gap-1"
        >
          <StockHeader stocks={details} data={prices} />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`
              transition-all duration-300
              ${isSelecting ? "ring-2 ring-indigo-500 shadow-2xl scale-[1.01]" : ""}
            `}
          >
            <StockChart
              chartData={prices}
              compareMode={compareMode}
              dragStart={dragStart}
              dragEnd={dragEnd}
              setDragStart={setDragStart}
              setDragEnd={setDragEnd}
              start={start}
              end={end}
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className={`transition-opacity duration-300 ${isSelecting ? "opacity-70" : "opacity-100"}`}
          >
            <RangeSelector range={range} onChange={setRange} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className={`
            w-full lg:flex-1 rounded-3xl
            transition-opacity duration-300
            ${isSelecting ? "opacity-60" : "opacity-100"}
          `}
        >
          <StockSnapshot
            compareMode={compareMode}
            setCompareMode={setCompareMode}
            dragStart={dragStart}
            dragEnd={dragEnd}
            setDragStart={setDragStart}
            setDragEnd={setDragEnd}
            start={start}
            end={end}
            data={prices}
            stocks={details}
          />
        </motion.div>

      </div>
    </div>
  )

}
