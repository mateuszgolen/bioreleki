import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="border-t border-neutral-200 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </dt>
      <dd className="mt-1 whitespace-pre-wrap text-base text-neutral-900">{value}</dd>
    </div>
  );
}

export default async function EmergencyCard({
  params,
}: PageProps<"/k/[viewToken]">) {
  const { viewToken } = await params;
  const profile = await prisma.profile.findUnique({
    where: { viewToken },
    include: { medications: { orderBy: { position: "asc" } } },
  });
  if (!profile) notFound();

  const age =
    profile.birthYear && profile.birthYear > 1900
      ? new Date().getFullYear() - profile.birthYear
      : null;

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-5 py-8">
      <div className="rounded-2xl border border-red-200 bg-white shadow-sm">
        <div className="rounded-t-2xl bg-red-600 px-5 py-3 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide">
            Informacja ratunkowa
          </p>
        </div>

        <div className="px-5 py-4">
          <h1 className="text-2xl font-semibold text-neutral-900">
            {profile.fullName || "—"}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {age ? `Wiek ok. ${age} lat` : null}
            {age && profile.bloodType ? " · " : null}
            {profile.bloodType ? `Grupa krwi ${profile.bloodType}` : null}
          </p>

          <dl>
            <Row label="Choroby przewlekłe" value={profile.conditions} />
            <Row label="Alergie / uczulenia" value={profile.allergies} />

            <div className="border-t border-neutral-200 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Przyjmowane leki
              </dt>
              <dd className="mt-2">
                {profile.medications.length === 0 ? (
                  <p className="text-neutral-500">Brak podanych leków.</p>
                ) : (
                  <ul className="space-y-2">
                    {profile.medications.map((m) => (
                      <li key={m.id} className="rounded-lg bg-neutral-50 px-3 py-2">
                        <p className="font-medium text-neutral-900">{m.name}</p>
                        <p className="text-sm text-neutral-600">
                          {[m.dose, m.frequency].filter(Boolean).join(" · ")}
                          {m.notes ? ` — ${m.notes}` : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>

            <Row label="Dodatkowe informacje" value={profile.notes} />
            <Row
              label="Kontakt w nagłym wypadku"
              value={[profile.emergencyName, profile.emergencyPhone]
                .filter(Boolean)
                .join(" · ")}
            />
          </dl>

          <p className="mt-4 border-t border-neutral-200 pt-3 text-xs text-neutral-400">
            Ostatnia aktualizacja:{" "}
            {profile.updatedAt.toLocaleDateString("pl-PL")}
          </p>
        </div>
      </div>
    </main>
  );
}
