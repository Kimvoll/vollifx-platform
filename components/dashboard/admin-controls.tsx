"use client";

import { Activity, Save, ShieldCheck, SlidersHorizontal, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import { adminRules, adminStats, pools as fallbackPools } from "@/lib/dashboard-data";
import { authHeaders } from "@/lib/auth";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  balance: string;
  availableBalance?: string;
  roi?: string;
  role: string;
  kyc: string;
  status: string;
};

type AdminPool = {
  id: string;
  name: string;
  minimum: string;
  monthlyRoi: string;
  status: string;
  risk: string;
};

export function AdminControls() {
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [poolList, setPoolList] = useState<AdminPool[]>(fallbackPools);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedPoolId, setSelectedPoolId] = useState(fallbackPools[0]?.id || "");
  const [userDraft, setUserDraft] = useState({ balance: "$0.00", availableBalance: "$0.00", roi: "0.0%", kyc: "Pending", status: "Active" });
  const [poolDraft, setPoolDraft] = useState({ minimum: "$750", returnSummary: "5x weekly", status: "Open", risk: "Medium" });

  useEffect(() => {
    async function loadAdminData() {
      const [usersResponse, poolsResponse] = await Promise.all([
        fetch("/api/admin/users", { headers: authHeaders() }),
        fetch("/api/pools", { headers: authHeaders() })
      ]);
      const usersData = await usersResponse.json().catch(() => ({}));
      const poolsData = await poolsResponse.json().catch(() => ({}));
      if (usersResponse.ok) {
        setUsers(usersData.users || []);
        if (usersData.users?.[0]) {
          setSelectedUserId(usersData.users[0].id);
          setUserDraft({
            balance: usersData.users[0].balance || "$0.00",
            availableBalance: usersData.users[0].availableBalance || usersData.users[0].balance || "$0.00",
            roi: usersData.users[0].roi || "0.0%",
            kyc: usersData.users[0].kyc || "Pending",
            status: usersData.users[0].status || "Active"
          });
        }
      }
      if (poolsResponse.ok && poolsData.pools?.length) {
        setPoolList(poolsData.pools);
        setSelectedPoolId(poolsData.pools[0].id);
        setPoolDraft({
          minimum: poolsData.pools[0].minimum || "$750",
          returnSummary: poolsData.pools[0].monthlyRoi || "5x weekly",
          status: poolsData.pools[0].status || "Open",
          risk: poolsData.pools[0].risk || "Medium"
        });
      }
    }
    loadAdminData();
  }, []);

  function selectUser(userId: string) {
    const user = users.find((item) => item.id === userId);
    setSelectedUserId(userId);
    if (user) {
      setUserDraft({
        balance: user.balance || "$0.00",
        availableBalance: user.availableBalance || user.balance || "$0.00",
        roi: user.roi || "0.0%",
        kyc: user.kyc || "Pending",
        status: user.status || "Active"
      });
    }
  }

  function selectPool(poolId: string) {
    const pool = poolList.find((item) => item.id === poolId);
    setSelectedPoolId(poolId);
    if (pool) {
      setPoolDraft({
        minimum: pool.minimum,
        returnSummary: pool.monthlyRoi,
        status: pool.status,
        risk: pool.risk
      });
    }
  }

  async function saveUserOverride() {
    if (!selectedUserId) {
      setMessage("Select a user before saving account controls.");
      return;
    }
    const response = await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ userId: selectedUserId, ...userDraft })
    });
    const data = await response.json();
    setMessage(data.message);
  }

  async function savePoolOverride() {
    const response = await fetch("/api/admin/pools", {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ poolId: selectedPoolId, ...poolDraft })
    });
    const data = await response.json();
    setMessage(data.message);
  }

  async function saveRules() {
    const response = await fetch("/api/admin/rules", {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({
        rules: adminRules,
        modules: {
          portfolio: true,
          pools: true,
          deposit: true,
          withdraw: true,
          kyc: true,
          settings: true
        }
      })
    });
    const data = await response.json();
    setMessage(data.message);
  }

  async function saveOperations() {
    const response = await fetch("/api/admin/operations", {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({
        operations: adminStats,
        platformStatus: "Operational",
        depositsEnabled: true,
        withdrawalsEnabled: true,
        poolJoiningEnabled: true,
        kycRequired: true
      })
    });
    const data = await response.json();
    setMessage(data.message);
  }

  return (
    <div className="grid gap-6">
      {message ? <div className="rounded-lg border border-emeraldx/30 bg-emeraldx/10 p-4 text-sm font-bold text-emeraldx">{message}</div> : null}
      <AdminCard icon={Activity} title="Platform Operations" button="Save Operations" onSave={saveOperations}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {adminStats.map(([label, value]) => (
            <div className="rounded-lg bg-white/6 p-4 text-sm font-bold light:bg-slate-100" key={label}>
              <p className="text-slate-400 light:text-slate-600">{label}</p>
              <p className="mt-2 text-xl font-black text-white light:text-slate-950">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {["Deposits Enabled", "Withdrawals Enabled", "Pool Joining Enabled", "KYC Required"].map((item) => (
            <label className="flex items-center justify-between rounded-lg bg-white/6 p-4 text-sm font-bold light:bg-slate-100" key={item}>
              {item}
              <input className="h-5 w-5 accent-emeraldx" defaultChecked type="checkbox" />
            </label>
          ))}
        </div>
      </AdminCard>
      <div className="grid gap-6 xl:grid-cols-3">
        <AdminCard icon={UserCog} title="User Account Controls" button="Save User Controls" onSave={saveUserOverride}>
          <div className="grid gap-3">
            <label className="grid gap-2 text-sm font-bold">
              Investor
              <select className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none light:border-slate-200 light:bg-white" onChange={(event) => selectUser(event.target.value)} value={selectedUserId}>
                {users.length === 0 ? <option value="">No investors available</option> : users.map((user) => (
                  <option key={user.id} value={user.id}>{user.name} - {user.email}</option>
                ))}
              </select>
            </label>
            <input className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none light:border-slate-200 light:bg-white" onChange={(event) => setUserDraft((value) => ({ ...value, balance: event.target.value }))} placeholder="Balance" value={userDraft.balance} />
            <input className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none light:border-slate-200 light:bg-white" onChange={(event) => setUserDraft((value) => ({ ...value, availableBalance: event.target.value }))} placeholder="Available balance" value={userDraft.availableBalance} />
            <input className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none light:border-slate-200 light:bg-white" onChange={(event) => setUserDraft((value) => ({ ...value, roi: event.target.value }))} placeholder="ROI" value={userDraft.roi} />
            <select className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none light:border-slate-200 light:bg-white" onChange={(event) => setUserDraft((value) => ({ ...value, kyc: event.target.value }))} value={userDraft.kyc}>
              <option>Pending</option>
              <option>Verified</option>
              <option>Review</option>
              <option>Rejected</option>
            </select>
          </div>
        </AdminCard>

        <AdminCard icon={SlidersHorizontal} title="Pool Controls" button="Save Pool Controls" onSave={savePoolOverride}>
          <div className="grid gap-3">
            <select className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none light:border-slate-200 light:bg-white" onChange={(event) => selectPool(event.target.value)} value={selectedPoolId}>
              {poolList.map((pool) => <option key={pool.id} value={pool.id}>{pool.name}</option>)}
            </select>
            <input className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none light:border-slate-200 light:bg-white" onChange={(event) => setPoolDraft((value) => ({ ...value, minimum: event.target.value }))} value={poolDraft.minimum} />
            <input className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none light:border-slate-200 light:bg-white" onChange={(event) => setPoolDraft((value) => ({ ...value, returnSummary: event.target.value }))} value={poolDraft.returnSummary} />
            <select className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm outline-none light:border-slate-200 light:bg-white" onChange={(event) => setPoolDraft((value) => ({ ...value, status: event.target.value }))} value={poolDraft.status}>
              <option>Open</option>
              <option>Limited</option>
              <option>Closed</option>
            </select>
          </div>
        </AdminCard>

        <AdminCard icon={ShieldCheck} title="Dashboard Rules" button="Save Rules" onSave={saveRules}>
          <div className="grid gap-2">
            {adminRules.map((rule) => (
              <label className="flex items-start gap-3 rounded-lg bg-white/6 p-3 text-sm light:bg-slate-100" key={rule}>
                <input className="mt-1 h-4 w-4 accent-emeraldx" defaultChecked type="checkbox" />
                <span>{rule}</span>
              </label>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

function AdminCard({ icon: Icon, title, button, children, onSave }: { icon: any; title: string; button: string; children: React.ReactNode; onSave: () => void }) {
  return (
    <div className="glass rounded-lg p-5">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emeraldx/10 text-emeraldx">
          <Icon size={22} />
        </span>
        <h2 className="text-lg font-black">{title}</h2>
      </div>
      {children}
      <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emeraldx px-5 py-3 text-sm font-black text-ink shadow-glow transition hover:bg-white" onClick={onSave} type="button">
        <Save size={17} /> {button}
      </button>
    </div>
  );
}
