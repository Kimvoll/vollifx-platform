"use client";

import { useMemo, useState } from "react";
import { PoolCard } from "@/components/dashboard/pool-card";
import { pools } from "@/lib/dashboard-data";

const filters = ["All", "Gold", "USOIL, NAS100", "Medium", "Popular"];

export default function PoolsPage() {
  const [filter, setFilter] = useState("All");
  const visible = useMemo(() => pools.filter((pool) => filter === "All" || pool.risk === filter || pool.asset === filter || (filter === "Popular" && pool.popular)), [filter]);

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-goldx">Investment Pools</p>
        <h1 className="mt-2 text-3xl font-black text-white light:text-slate-950">Professional Managed Pools</h1>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((item) => (
          <button className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${filter === item ? "bg-emeraldx text-ink" : "glass text-slate-300 light:text-slate-700"}`} key={item} onClick={() => setFilter(item)} type="button">
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        {visible.map((pool) => <PoolCard key={pool.id} pool={pool} />)}
      </div>
    </div>
  );
}
