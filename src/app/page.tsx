import { createProfile } from "./actions";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-8 px-5 py-16">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Karta ratunkowa
        </h1>
        <p className="text-lg text-neutral-600">
          Zapisz informację o swojej chorobie przewlekłej i lekach, które
          przyjmujesz. Wygeneruj kod QR, wydrukuj go na karcie lub bransoletce —
          w razie wypadku służby ratunkowe zeskanują go i od razu zobaczą, co
          jest istotne.
        </p>
      </div>

      <form action={createProfile}>
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-5 py-3 text-base font-medium text-white transition hover:bg-neutral-700"
        >
          Utwórz kartę
        </button>
      </form>

      <ol className="space-y-2 text-sm text-neutral-500">
        <li>1. Wpisz podstawowe dane, chorobę i listę leków.</li>
        <li>2. Zapisz sekretny link do edycji — wrócisz nim, gdy coś się zmieni.</li>
        <li>3. Pobierz kod QR i umieść go na karcie lub opasce.</li>
      </ol>

      <p className="text-xs text-neutral-400">
        Strona z kodu QR jest dostępna bez logowania — to celowe, by ratownik miał
        natychmiastowy dostęp. Nie umieszczaj tu danych, których nie chcesz
        pokazać osobie, która znajdzie kartę.
      </p>
    </main>
  );
}
