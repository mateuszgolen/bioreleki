"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

type Med = { name: string; dose: string; frequency: string; notes: string };

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial: {
    fullName: string;
    birthYear: string;
    bloodType: string;
    conditions: string;
    allergies: string;
    notes: string;
    emergencyName: string;
    emergencyPhone: string;
    medications: Med[];
  };
};

const field =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900";
const labelCls = "block text-sm font-medium text-neutral-700";

const BLOOD_TYPES = ["A Rh+", "A Rh-", "B Rh+", "B Rh-", "AB Rh+", "AB Rh-", "0 Rh+", "0 Rh-"];

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50"
    >
      {pending ? "Zapisywanie…" : "Zapisz zmiany"}
    </button>
  );
}

export default function EditForm({ action, initial }: Props) {
  const [meds, setMeds] = useState<Med[]>(
    initial.medications.length
      ? initial.medications
      : [{ name: "", dose: "", frequency: "", notes: "" }],
  );

  const updateMed = (i: number, key: keyof Med, value: string) =>
    setMeds((prev) => prev.map((m, idx) => (idx === i ? { ...m, [key]: value } : m)));

  return (
    <form action={action} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Dane osoby</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <label className={labelCls} htmlFor="fullName">Imię i nazwisko</label>
            <input id="fullName" name="fullName" defaultValue={initial.fullName} className={field} />
          </div>
          <div className="space-y-1">
            <label className={labelCls} htmlFor="birthYear">Rok urodzenia</label>
            <input id="birthYear" name="birthYear" inputMode="numeric" placeholder="np. 1985" defaultValue={initial.birthYear} className={field} />
          </div>
          <div className="space-y-1">
            <label className={labelCls} htmlFor="bloodType">Grupa krwi</label>
            <select id="bloodType" name="bloodType" defaultValue={initial.bloodType} className={field}>
              <option value="">Nie podano</option>
              {BLOOD_TYPES.map((bt) => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Stan zdrowia</h2>
        <div className="space-y-1">
          <label className={labelCls} htmlFor="conditions">Choroby przewlekłe</label>
          <textarea id="conditions" name="conditions" rows={2} placeholder="np. cukrzyca typu 1, nadciśnienie" defaultValue={initial.conditions} className={field} />
        </div>
        <div className="space-y-1">
          <label className={labelCls} htmlFor="allergies">Alergie / uczulenia</label>
          <textarea id="allergies" name="allergies" rows={2} placeholder="np. penicylina, orzechy" defaultValue={initial.allergies} className={field} />
        </div>
        <div className="space-y-1">
          <label className={labelCls} htmlFor="notes">Dodatkowe informacje dla ratownika</label>
          <textarea id="notes" name="notes" rows={2} defaultValue={initial.notes} className={field} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Leki</h2>
          <button
            type="button"
            onClick={() => setMeds((p) => [...p, { name: "", dose: "", frequency: "", notes: "" }])}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
          >
            + Dodaj lek
          </button>
        </div>

        <div className="space-y-4">
          {meds.map((m, i) => (
            <div key={i} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="medName" value={m.name} onChange={(e) => updateMed(i, "name", e.target.value)} placeholder="Nazwa leku" className={field} />
                <input name="medDose" value={m.dose} onChange={(e) => updateMed(i, "dose", e.target.value)} placeholder="Dawka, np. 10 mg" className={field} />
                <input name="medFrequency" value={m.frequency} onChange={(e) => updateMed(i, "frequency", e.target.value)} placeholder="Częstotliwość, np. 2x dziennie" className={field} />
                <input name="medNotes" value={m.notes} onChange={(e) => updateMed(i, "notes", e.target.value)} placeholder="Uwagi (opcjonalnie)" className={field} />
              </div>
              <div className="mt-3 text-right">
                <button
                  type="button"
                  onClick={() => setMeds((p) => p.filter((_, idx) => idx !== i))}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-400">Puste wiersze (bez nazwy leku) nie zostaną zapisane.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Kontakt w nagłym wypadku</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className={labelCls} htmlFor="emergencyName">Osoba</label>
            <input id="emergencyName" name="emergencyName" defaultValue={initial.emergencyName} className={field} />
          </div>
          <div className="space-y-1">
            <label className={labelCls} htmlFor="emergencyPhone">Telefon</label>
            <input id="emergencyPhone" name="emergencyPhone" inputMode="tel" defaultValue={initial.emergencyPhone} className={field} />
          </div>
        </div>
      </section>

      <SaveButton />
    </form>
  );
}
