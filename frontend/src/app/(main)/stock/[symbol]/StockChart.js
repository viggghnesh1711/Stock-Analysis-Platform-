"use client";

import React, { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive line chart";

const chartConfig = {
  views: {
    label: "Price",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
};

export default function StockChart({
  compareMode,
  chartData,
  dragStart,
  dragEnd,
  setDragStart,
  setDragEnd,
  start,
  end,
}) {
  const total = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.close_price, 0);
  }, [chartData]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

return (
  <Card className="py-4 sm:py-0 w-full mt-6">
    <CardContent className="px-2 sm:p-6">
      <ChartContainer
        config={chartConfig}
        className="
          w-full
          h-[240px]
          sm:h-[380px]
          md:h-[340px]
          lg:h-[320px]
        "
      >
        <LineChart
          data={chartData}
          margin={{
            left: isMobile ? 0 : 10,
            right: 12,
            top: 10,
            bottom: 0
          }}
          onClick={(state) => {
            if (!compareMode) return;
            const point = state?.activePayload?.[0]?.payload;
            if (!point) return;
            const selectedDate = point.price_date;
            if (!dragStart) {
              setDragStart(selectedDate);
            } else if (!dragEnd) {
              setDragEnd(selectedDate);
            } else {
              setDragStart(selectedDate);
              setDragEnd(null);
            }
          }}
        >
          <CartesianGrid vertical={false} />

          <XAxis
            dataKey="price_date"
            padding={{ left: 10, right: 10 }}
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            minTickGap={50}
            interval="preserveStartEnd"
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />

          {!isMobile && (
            <YAxis
              domain={["dataMin - 2", "dataMax + 2"]}
              tickLine={false}
              axisLine={false}
              width={40}
            />
          )}

          {isMobile && (
            <YAxis
              domain={["dataMin - 2", "dataMax + 2"]}
              tickLine={true}
              axisLine={false}
              width={0}
            />
          )}

          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[140px] sm:w-[150px]"
                nameKey="views"
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
              />
            }
          />

          <Line
            dataKey="close_price"
            type="linear"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={false}
          />

          {compareMode && dragStart && (
            <ReferenceLine x={dragStart} stroke="white" strokeDasharray="3 3" />
          )}

          {compareMode && dragEnd && (
            <ReferenceLine x={dragEnd} stroke="white" strokeDasharray="3 3" />
          )}

          {compareMode && dragStart && dragEnd && (
            <ReferenceArea
              x1={dragStart}
              x2={dragEnd}
              fill="white"
              fillOpacity={0.08}
            />
          )}
        </LineChart>
      </ChartContainer>
    </CardContent>
  </Card>
);

}
