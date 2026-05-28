import { SettingsPanel } from "@/components/dashboard/settings-panel";

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-goldx">Preferences</p>
        <h1 className="mt-2 text-3xl font-black">Notification Settings</h1>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <SettingsPanel title="Notifications System" items={["Profit payout alerts", "Deposit confirmations", "Withdrawal approvals", "Pool updates"]} />
        <SettingsPanel title="Platform Controls" items={["Dark mode preference", "Weekly investor digest", "Weekly profit statements", "Risk threshold alerts"]} />
      </div>
    </div>
  );
}
