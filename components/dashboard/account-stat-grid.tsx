"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { authHeaders } from "@/lib/auth";

type AccountStats = {
  totalBalance: string;
  activeInvestment: string;
  totalProfit: string;
  roi: string;
  availableBalance: string;
  pendingWithdrawals: string;
};

const emptyStats: AccountStats = {
  totalBalance: "$0.00",
  activeInvestment: "$0.00",
  totalProfit: "$0.00",
  roi: "0.0%",
  availableBalance: "$0.00",
  pendingWithdrawals: "$0.00"
};

function numeric(value: string) {
  return Number(String(value || "0").replace(/[^0-9.-]/g, "")) || 0;
}

function money(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function AccountStatGrid() {
  const [stats, setStats] = useState<AccountStats>(emptyStats);

  useEffect(() => {
    let active = true;
    async function loadStats() {
      const [profileResponse, transactionsResponse] = await Promise.all([
        fetch("/api/profile", { headers: authHeaders() }),
        fetch("/api/transactions", { headers: authHeaders() })
      ]);
      const profileData = await profileResponse.json().catch(() => ({}));
      const transactionsData = await transactionsResponse.json().catch(() => ({}));
      if (!active || !profileResponse.ok) return;

      const transactions = transactionsResponse.ok ? transactionsData.transactions || [] : [];
      const pendingWithdrawals = transactions
        .filter((item: any) => item.type === "Withdrawal" && ["Pending", "Processing", "Pending Review"].includes(item.status))
        .reduce((total: number, item: any) => total + numeric(item.amount), 0);
      const approvedDeposits = transactions
        .filter((item: any) => item.type === "Deposit" && item.status === "Approved")
        .reduce((total: number, item: any) => total + numeric(item.amount), 0);
      const totalBalance = numeric(profileData.balance);
      const availableBalance = numeric(profileData.availableBalance);

      setStats({
        totalBalance: profileData.balance || "$0.00",
        activeInvestment: money(Math.max(totalBalance - availableBalance, 0)),
        totalProfit: money(Math.max(totalBalance - approvedDeposits, 0)),
        roi: profileData.roi || "0.0%",
        availableBalance: profileData.availableBalance || "$0.00",
        pendingWithdrawals: money(pendingWithdrawals)
      });
    }
    loadStats();
    const timer = window.setInterval(loadStats, 12000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <StatCard label="Total Portfolio Balance" value={stats.totalBalance} change="Live" trend="neutral" />
      <StatCard label="Active Investment" value={stats.activeInvestment} change="Allocated" trend="neutral" />
      <StatCard label="Total Profit" value={stats.totalProfit} change="Net" trend={numeric(stats.totalProfit) > 0 ? "up" : "neutral"} />
      <StatCard label="ROI Percentage" value={stats.roi} change="Admin set" trend={numeric(stats.roi) > 0 ? "up" : "neutral"} />
      <StatCard label="Available Balance" value={stats.availableBalance} change="Spendable" trend="neutral" />
      <StatCard label="Pending Withdrawals" value={stats.pendingWithdrawals} change="Pending" trend={numeric(stats.pendingWithdrawals) > 0 ? "down" : "neutral"} />
    </div>
  );
}
