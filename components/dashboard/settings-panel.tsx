import { SaveSettingsButton } from "@/components/dashboard/save-settings-button";

export function SettingsPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="glass rounded-lg p-5">
      <h2 className="text-lg font-black text-white light:text-slate-950">{title}</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <label className="flex items-center justify-between rounded-lg bg-white/6 p-4 text-sm font-bold light:bg-slate-100" key={item}>
            {item}
            <input className="h-5 w-5 accent-emeraldx" type="checkbox" defaultChecked />
          </label>
        ))}
      </div>
      <SaveSettingsButton title={title} />
    </div>
  );
}
