"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { growthData, portfolioAllocations, weeklyData } from "@/lib/dashboard-data";

const colors = ["#20e29c", "#d7b56d", "#38bdf8", "#a78bfa", "#fb7185"];

export function ChartCard({ title, type }: { title: string; type: "growth" | "weekly" | "roi" | "pie" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="glass rounded-lg p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black text-white light:text-slate-950">{title}</h2>
        <span className="rounded-full bg-emeraldx/10 px-3 py-1 text-xs font-black text-emeraldx">Live</span>
      </div>
      <div className="h-72">
        {mounted ? (
        <ResponsiveContainer height="100%" minHeight={260} minWidth={260} width="100%">
          {type === "growth" ? (
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="growth" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#20e29c" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#20e29c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,.14)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} />
              <Area dataKey="value" fill="url(#growth)" stroke="#20e29c" strokeWidth={3} type="monotone" />
            </AreaChart>
          ) : type === "weekly" ? (
            <BarChart data={weeklyData}>
              <CartesianGrid stroke="rgba(148,163,184,.14)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} />
              <Bar dataKey="profit" radius={[6, 6, 0, 0]}>
                {weeklyData.map((entry) => (
                  <Cell fill={entry.profit >= 0 ? "#20e29c" : "#fb7185"} key={entry.name} />
                ))}
              </Bar>
            </BarChart>
          ) : type === "pie" ? (
            <PieChart>
              <Pie data={portfolioAllocations} dataKey="value" innerRadius={58} outerRadius={96} paddingAngle={4}>
                {portfolioAllocations.map((entry, index) => (
                  <Cell fill={colors[index % colors.length]} key={entry.name} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} />
            </PieChart>
          ) : (
            <AreaChart data={growthData}>
              <CartesianGrid stroke="rgba(148,163,184,.14)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} />
              <Area dataKey="roi" fill="rgba(215,181,109,.18)" stroke="#d7b56d" strokeWidth={3} type="monotone" />
            </AreaChart>
          )}
        </ResponsiveContainer>
        ) : (
          <div className="h-full rounded-lg bg-white/6 light:bg-slate-100" />
        )}
      </div>
    </div>
  );
}
