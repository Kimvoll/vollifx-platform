export const dashboardStats = [
  { label: "Total Portfolio Balance", value: "$0.00", change: "0.0%", trend: "neutral" },
  { label: "Active Investment", value: "$0.00", change: "0.0%", trend: "neutral" },
  { label: "Total Profit", value: "$0.00", change: "0.0%", trend: "neutral" },
  { label: "ROI Percentage", value: "0.0%", change: "0.0%", trend: "neutral" },
  { label: "Available Balance", value: "$0.00", change: "0.0%", trend: "neutral" },
  { label: "Pending Withdrawals", value: "$0.00", change: "0 pending", trend: "neutral" }
];

export const growthData = [
  { name: "Jan", value: 0, roi: 0, weekly: 0 },
  { name: "Feb", value: 0, roi: 0, weekly: 0 },
  { name: "Mar", value: 0, roi: 0, weekly: 0 },
  { name: "Apr", value: 0, roi: 0, weekly: 0 },
  { name: "May", value: 0, roi: 0, weekly: 0 },
  { name: "Jun", value: 0, roi: 0, weekly: 0 }
];

export const weeklyData = [
  { name: "Mon", profit: 0 },
  { name: "Tue", profit: 0 },
  { name: "Wed", profit: 0 },
  { name: "Thu", profit: 0 },
  { name: "Fri", profit: 0 }
];

export const pools = [
  {
    id: "gold-pool",
    name: "Gold Pool",
    manager: "Volli",
    capital: "$0",
    monthlyRoi: "5x weekly",
    winRate: "0%",
    drawdown: "0%",
    risk: "Medium",
    investors: 11,
    minimum: "$750",
    status: "Open",
    asset: "Gold",
    popular: true,
    returnSummary: "Profit return: 5 times a week the capital"
  },
  {
    id: "usoil-nas100-pool",
    name: "USOIL & NAS100 Pool",
    manager: "Volli",
    capital: "$0",
    monthlyRoi: "5-10x weekly",
    winRate: "0%",
    drawdown: "0%",
    risk: "Medium",
    investors: 6,
    minimum: "$750",
    status: "Open",
    asset: "USOIL, NAS100",
    popular: true,
    returnSummary: "Profit return: 5-10 times a week the capital"
  }
];

export const activity: Array<{ type: string; detail: string; amount: string; status: string; time: string }> = [];

export const transactions: Array<{ id: string; method: string; type: string; amount: string; status: string; date: string }> = [];

export const portfolioAllocations = [
  { name: "Unallocated", value: 100 }
];

export const openTrades: Array<{ symbol: string; side: string; entry: string; pnl: string }> = [];

export const closedTrades: Array<{ symbol: string; result: string; date: string; pnl: string }> = [];

export const notifications = [
  "Welcome to VOLLIFX. Complete KYC and make your first deposit to begin."
];

export const adminStats = [
  ["Total users", "0"],
  ["Total deposits", "$0.00"],
  ["Total withdrawals", "$0.00"],
  ["Active pools", "2"],
  ["Total AUM", "$0.00"],
  ["Pending KYC", "0"]
];

export const adminUsers: Array<{ id: string; name: string; email: string; balance: string; role: string; kyc: string; status: string }> = [];

export const adminRules = [
  "Admin can edit user balance, available balance, pending withdrawals, and ROI display values.",
  "Admin can approve or reject KYC verification and withdrawal requests.",
  "Admin can update pool names, minimum deposits, profit-return labels, risk levels, and status.",
  "Admin can add manual deposits, profit payouts, withdrawals, and pool allocations to transaction history.",
  "Admin can enable or hide dashboard modules including portfolio, pools, deposit, withdraw, KYC, and settings.",
  "Only vollikip@gmail.com with the configured admin password can access /dashboard/admin."
];
