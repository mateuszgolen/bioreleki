"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

/** Tworzy nowy, pusty profil i przenosi do jego strony edycji. */
export async function createProfile() {
  const profile = await prisma.profile.create({ data: { fullName: "" } });
  redirect(`/edit/${profile.editToken}`);
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Zapisuje dane profilu oraz całą listę leków (podmiana). */
export async function saveProfile(editToken: string, formData: FormData) {
  const profile = await prisma.profile.findUnique({ where: { editToken } });
  if (!profile) redirect("/");

  const birthYearRaw = str(formData.get("birthYear"));
  const birthYear = /^\d{4}$/.test(birthYearRaw) ? Number(birthYearRaw) : null;

  const names = formData.getAll("medName").map(str);
  const doses = formData.getAll("medDose").map(str);
  const freqs = formData.getAll("medFrequency").map(str);
  const mnotes = formData.getAll("medNotes").map(str);

  const meds = names
    .map((name, i) => ({
      name,
      dose: doses[i] ?? "",
      frequency: freqs[i] ?? "",
      notes: mnotes[i] ?? "",
      position: i,
    }))
    .filter((m) => m.name.length > 0);

  await prisma.$transaction([
    prisma.profile.update({
      where: { id: profile.id },
      data: {
        fullName: str(formData.get("fullName")),
        birthYear,
        bloodType: str(formData.get("bloodType")),
        conditions: str(formData.get("conditions")),
        allergies: str(formData.get("allergies")),
        notes: str(formData.get("notes")),
        emergencyName: str(formData.get("emergencyName")),
        emergencyPhone: str(formData.get("emergencyPhone")),
      },
    }),
    prisma.medication.deleteMany({ where: { profileId: profile.id } }),
    ...(meds.length
      ? [prisma.medication.createMany({ data: meds.map((m) => ({ ...m, profileId: profile.id })) })]
      : []),
  ]);

  revalidatePath(`/edit/${editToken}`);
  revalidatePath(`/k/${profile.viewToken}`);
}

/** Trwale usuwa profil. */
export async function deleteProfile(editToken: string) {
  await prisma.profile.deleteMany({ where: { editToken } });
  redirect("/");
}
