import { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  text?: string;
  centered?: boolean;
  children?: ReactNode;
};

export function SectionHeading({ eyebrow, title, text, centered, children }: SectionHeadingProps) {
  return (
    <div className={`max-w-3xl ${centered ? "mx-auto text-center" : ""}`}>
      {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.28em] text-goldx">{eyebrow}</p> : null}
      <h2 className="mt-3 text-3xl font-black tracking-tight text-white light:text-slate-950 sm:text-4xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-7 text-slate-400 light:text-slate-600">{text}</p> : null}
      {children}
    </div>
  );
}
