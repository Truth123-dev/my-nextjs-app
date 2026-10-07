"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Organization {
  id: string;
  name: string;
  slug: string;
  role: string;
}

async function loadOrganizations(): Promise<Organization[]> {
  const response = await fetch("/api/v1/organizations");
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error ?? "Unable to load organizations");
  return result.items;
}

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const {
    data: organizations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: loadOrganizations,
  });
  const createOrganization = useMutation({
    mutationFn: async (organizationName: string) => {
      const response = await fetch("/api/v1/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: organizationName }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Unable to create organization");
      return result.data as { slug: string };
    },
    onSuccess: async (organization) => {
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      router.push(`/dashboard/${encodeURIComponent(organization.slug)}`);
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createOrganization.mutate(name.trim());
  }

  return (
    <section className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
          Ledger workspace
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Your organizations</h1>
        <p className="mt-2 text-sm text-slate-600">
          Choose a workspace or create one to start managing its ledger.
        </p>
      </header>

      {error && (
        <p
          role="alert"
          className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
        >
          {error.message}
        </p>
      )}
      {createOrganization.error && (
        <p
          role="alert"
          className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
        >
          {createOrganization.error.message}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading organizations…</p>
      ) : error ? null : organizations.length > 0 ? (
        <ul className="divide-y divide-slate-200 border-y border-slate-200">
          {organizations.map((organization) => (
            <li key={organization.id}>
              <Link
                href={`/dashboard/${encodeURIComponent(organization.slug)}`}
                className="flex items-center justify-between gap-4 py-4 hover:text-emerald-800"
              >
                <span className="flex items-center gap-3">
                  <Building2
                    aria-hidden="true"
                    className="text-emerald-800"
                    size={19}
                  />
                  <span>
                    <span className="block font-medium">
                      {organization.name}
                    </span>
                    <span className="mt-0.5 block text-xs capitalize text-slate-500">
                      {organization.role.replaceAll("_", " ")}
                    </span>
                  </span>
                </span>
                <span aria-hidden="true" className="text-slate-400">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border-y border-slate-200 py-5 text-sm text-slate-600">
          You don’t belong to an organization yet. Create one to get started.
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex max-w-xl flex-col gap-3 sm:flex-row"
      >
        <Input
          aria-label="Organization name"
          minLength={2}
          maxLength={100}
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Organization name"
        />
        <Button
          type="submit"
          disabled={createOrganization.isPending}
          className="shrink-0 bg-emerald-800 text-white hover:bg-emerald-900"
        >
          <Plus aria-hidden="true" size={16} />
          {createOrganization.isPending ? "Creating…" : "Create organization"}
        </Button>
      </form>
    </section>
  );
}
