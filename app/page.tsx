import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const capabilities = [
  {
    icon: Activity,
    title: "Transaction monitoring",
    description:
      "Review ledger activity and follow transfer status from one place.",
  },
  {
    icon: Building2,
    title: "Organization workspaces",
    description: "Keep each organization’s accounts and activity separated.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    description: "Give teammates access according to their responsibilities.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f7f5] text-slate-950">
      <header className="border-b border-slate-200/80 bg-white/85">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a
            href="#top"
            className="flex items-center gap-3"
            aria-label="Ledger workspace home"
          >
            <span className="grid size-9 place-items-center rounded-md bg-emerald-800 text-white">
              <Building2 aria-hidden="true" size={19} />
            </span>
            <span className="text-sm font-semibold tracking-wide">
              LEDGER WORKSPACE
            </span>
          </a>
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-800"
          >
            Sign in
          </Link>
        </div>
      </header>

      <div
        id="top"
        className="mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 sm:pt-16"
      >
        <section className="grid gap-10 border-b border-slate-200 pb-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:pb-16">
          <div>
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
              <span className="size-2 rounded-full bg-emerald-600" />
              Multi-tenant financial operations
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
              Company finances, in clear view.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              A secure workspace for managing organization accounts, tracking
              transfers, and reviewing your transaction ledger.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-md bg-emerald-800 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
            >
              Open your workspace
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Ledger overview
                </p>
                <h2 className="mt-1 text-lg font-semibold">
                  Activity at a glance
                </h2>
              </div>
              <span className="rounded-sm bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                Secure workspace
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 py-5">
              <div className="rounded-md bg-[#f4f7f5] p-4">
                <ArrowDownLeft
                  aria-hidden="true"
                  className="text-emerald-800"
                  size={18}
                />
                <p className="mt-4 text-sm font-medium">Incoming activity</p>
                <p className="mt-1 text-xs text-slate-500">
                  Credits recorded in your ledger
                </p>
              </div>
              <div className="rounded-md bg-[#f4f7f5] p-4">
                <ArrowUpRight
                  aria-hidden="true"
                  className="text-slate-700"
                  size={18}
                />
                <p className="mt-4 text-sm font-medium">Outgoing transfers</p>
                <p className="mt-1 text-xs text-slate-500">
                  Payments with clear status
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
              <ShieldCheck
                aria-hidden="true"
                className="shrink-0 text-emerald-800"
                size={18}
              />
              Organization data stays scoped to its members.
            </div>
          </div>
        </section>

        <section id="capabilities" className="pt-10 sm:pt-14">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                Workspace essentials
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Built for careful financial operations
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600">
              Keep routine review, team access, and payment activity in a
              consistent workflow.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="border-t-2 border-emerald-800 bg-white p-5 sm:p-6"
              >
                <Icon
                  aria-hidden="true"
                  className="text-emerald-800"
                  size={20}
                />
                <h3 className="mt-5 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
