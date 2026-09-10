import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { qrPngDataUrl } from "@/lib/qr";
import { getBaseUrl } from "@/lib/url";
import { deleteProfile, saveProfile } from "@/app/actions";
import EditForm from "./EditForm";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }: PageProps<"/edit/[editToken]">) {
  const { editToken } = await params;
  const profile = await prisma.profile.findUnique({
    where: { editToken },
    include: { medications: { orderBy: { position: "asc" } } },
  });
  if (!profile) notFound();

  const baseUrl = await getBaseUrl();
  const publicUrl = `${baseUrl}/k/${profile.viewToken}`;
  const qr = await qrPngDataUrl(publicUrl);

  const saveAction = saveProfile.bind(null, editToken);
  const deleteAction = deleteProfile.bind(null, editToken);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Twoja karta ratunkowa</h1>

      <div className="mt-6 grid gap-6 rounded-2xl border border-neutral-200 bg-white p-5 sm:grid-cols-[auto_1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="Kod QR do strony ratunkowej" className="h-40 w-40 shrink-0" />
        <div className="space-y-2 text-sm">
          <p className="font-medium">Strona ratunkowa (w kodzie QR):</p>
          <Link href={publicUrl} className="break-all text-blue-600 underline" target="_blank">
            {publicUrl}
          </Link>
          <p className="text-neutral-500">
            Ten kod umieść na karcie lub bransoletce. Po zeskanowaniu pokazuje dane
            do odczytu, bez logowania.
          </p>
          <a
            href={qr}
            download="karta-ratunkowa-qr.png"
            className="inline-block rounded-lg border border-neutral-300 px-3 py-1.5 font-medium hover:bg-neutral-100"
          >
            Pobierz kod QR (PNG)
          </a>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-medium">Zachowaj ten adres — to Twój prywatny link do edycji:</p>
        <p className="mt-1 break-all font-mono text-xs">{baseUrl}/edit/{editToken}</p>
        <p className="mt-1 text-amber-700">
          Kto ma ten link, może zmieniać dane. Nie udostępniaj go publicznie.
        </p>
      </div>

      <div className="mt-8">
        <EditForm
          action={saveAction}
          initial={{
            fullName: profile.fullName,
            birthYear: profile.birthYear ? String(profile.birthYear) : "",
            bloodType: profile.bloodType ?? "",
            conditions: profile.conditions,
            allergies: profile.allergies,
            notes: profile.notes,
            emergencyName: profile.emergencyName,
            emergencyPhone: profile.emergencyPhone,
            medications: profile.medications.map((m) => ({
              name: m.name,
              dose: m.dose,
              doseUnit: m.doseUnit,
              frequency: m.frequency,
              notes: m.notes,
            })),
          }}
        />
      </div>

      <form action={deleteAction} className="mt-12 border-t border-neutral-200 pt-6">
        <button
          type="submit"
          className="text-sm font-medium text-red-600 hover:text-red-800"
        >
          Usuń tę kartę na stałe
        </button>
      </form>
    </main>
  );
}
