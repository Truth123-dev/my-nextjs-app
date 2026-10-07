import Link from "next/link";

export default async function OrganizationPage({ params }: PageProps<"/dashboard/[orgSlug]">) {
  const { orgSlug } = await params;
  return (
    <section className="space-y-4">
      <p className="text-sm font-medium text-emerald-800">Organization workspace</p>
      <h1 className="text-3xl font-semibold">{orgSlug.replaceAll("-", " ")}</h1>
      <p className="text-slate-600">Review your organization’s ledger and transfer activity.</p>
      <Link className="inline-flex rounded-md bg-emerald-800 px-4 py-2 text-sm font-semibold text-white" href={`/dashboard/${encodeURIComponent(orgSlug)}/transactions`}>View transactions</Link>
    </section>
  );
}
