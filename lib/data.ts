import {
  BarChart3,
  Globe2,
  HandCoins,
  LineChart,
  LockKeyhole,
  Radio,
  ShieldCheck,
  Smartphone,
  UsersRound,
  WalletCards
} from "lucide-react";

export const ticker = [
  { symbol: "EUR/USD", price: "1.0874", change: "+0.18%" },
  { symbol: "GBP/USD", price: "1.2731", change: "+0.11%" },
  { symbol: "XAU/USD", price: "2,417.80", change: "+0.72%" },
  { symbol: "BTC/USD", price: "68,920", change: "-0.34%" },
  { symbol: "NAS100", price: "19,421.5", change: "+0.44%" },
  { symbol: "US30", price: "39,844", change: "-0.09%" },
  { symbol: "USD/JPY", price: "156.28", change: "+0.21%" }
];

export const tradingCards = [
  { symbol: "XAUUSD", name: "Gold Spot", price: "2,417.80", change: "+0.72%", up: true },
  { symbol: "USOIL", name: "WTI Crude", price: "78.44", change: "-0.18%", up: false },
  { symbol: "NAS100", name: "US Tech 100", price: "19,421.5", change: "+0.44%", up: true }
];

export const features = [
  { icon: WalletCards, title: "Managed Trading Pools", text: "Allocate capital into monitored pools built around defined strategies, limits, and performance benchmarks." },
  { icon: HandCoins, title: "Performance-Based Returns", text: "Track realized outcomes with transparent dashboards designed for disciplined capital participation." },
  { icon: ShieldCheck, title: "Advanced Risk Management", text: "Structured exposure controls, drawdown rules, and active monitoring protect the trading process." },
  { icon: Globe2, title: "Global Access", text: "A mobile-first platform experience for international traders and capital partners." },
  { icon: UsersRound, title: "Community Driven", text: "Join a focused ecosystem of active traders, analysts, and performance-minded members." },
  { icon: Smartphone, title: "Mobile First Experience", text: "Clean, responsive workflows keep deposits, allocations, and analytics easy to manage anywhere." }
];

export const steps = [
  "Create Account & Deposit",
  "Allocate Capital",
  "Performance Trading",
  "Withdraw or Compound"
];

export const compliance = [
  { name: "CySEC", text: "European regulatory standards and client protection principles." },
  { name: "FCA", text: "Governance inspired by stringent UK financial conduct expectations." },
  { name: "ASIC", text: "Operational discipline aligned with institutional market oversight." }
];

export const faqs = [
  ["What is VOLLIFX?", "VOLLIFX is a premium forex and CFD trading platform focused on capital allocation, managed trading pools, real-time analytics, and transparent performance management."],
  ["How do I start trading?", "Create an account, complete the onboarding checks, deposit capital, and select the trading pool or account workflow that matches your risk profile."],
  ["What is the minimum deposit and withdrawal?", "The minimum pool investment is $750. Withdrawal availability depends on account balance, verification status, pool rules, and compliance review."],
  ["How does the Active Trading Pool work?", "The pool aggregates allocated capital under a defined strategy, tracks performance in real time, and applies risk rules before traders choose to withdraw or compound."],
  ["Is my personal information secure?", "VOLLIFX uses protected authentication, role-based access, secure account records, and verification controls for investor data."],
  ["Can I withdraw my funds at any time?", "Withdrawal availability depends on pool rules, settlement windows, and compliance checks. The UI is ready for withdrawal state and policy messaging."],
  ["What fees do you charge?", "Applicable platform, payment, network, and performance fees are shown during funding, allocation, and withdrawal review where relevant."]
];

export const aboutStats = [
  ["Trades Executed", "0"],
  ["Capital Allocated", "$0"],
  ["Global Traders", "0"],
  ["Countries Served", "0"]
];

export const authBenefits = [
  { icon: LockKeyhole, title: "Bank-Grade Security" },
  { icon: ShieldCheck, title: "ASIC Regulated" },
  { icon: Radio, title: "Live Risk Monitoring" },
  { icon: BarChart3, title: "Realtime Analytics" }
];

export const chartPoints = [
  { label: "09:00", price: "2401.2" },
  { label: "10:30", price: "2408.6" },
  { label: "12:00", price: "2398.9" },
  { label: "13:30", price: "2415.4" },
  { label: "15:00", price: "2417.8" }
];
