import { SettingsPanel } from "@/components/dashboard/settings-panel";
import { SaveProfileButton } from "@/components/dashboard/save-profile-button";

export default function ProfilePage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-goldx">Profile</p>
        <h1 className="mt-2 text-3xl font-black">Profile Settings</h1>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="glass rounded-lg p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emeraldx text-2xl font-black text-ink">AS</div>
          <div className="mt-6 grid gap-4">
            {["Full Name", "Email", "Phone", "Country"].map((label) => (
              <label className="grid gap-2 text-sm font-bold" key={label}>
                {label}
                <input className="rounded-lg border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emeraldx light:border-slate-200 light:bg-white" defaultValue="" />
              </label>
            ))}
          </div>
          <SaveProfileButton />
        </div>
        <SettingsPanel title="Security Settings" items={["Two-factor authentication UI", "Login alerts", "Withdrawal confirmation", "Device trust management"]} />
      </div>
    </div>
  );
}
