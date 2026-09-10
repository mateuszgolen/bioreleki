# Karta ratunkowa

Aplikacja dla osób z chorobami przewlekłymi: tworzysz kartę z informacją o chorobie
i przyjmowanych lekach, dostajesz kod QR. Kod drukujesz na plastikowej karcie lub
bransoletce — w razie wypadku służby ratunkowe skanują go i widzą, co jest istotne.

## Stack

| Warstwa | Technologia |
|---|---|
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| Baza danych | Prisma 7 + SQLite (dev) → Postgres (prod) |
| Styl | Tailwind CSS 4 |
| Kod QR | `qrcode` |

## Jak to działa (MVP, bez kont użytkownika)

Każdy profil ma dwa losowe tokeny:

- **`viewToken`** — trafia do kodu QR. Strona `/k/<viewToken>` jest publiczna, tylko do
  odczytu. Celowo bez logowania, żeby ratownik miał natychmiastowy dostęp.
- **`editToken`** — sekretny link `/edit/<editToken>` do edycji danych. Użytkownik go
  zachowuje (np. w notatkach / mailu do siebie).

Konta użytkownika (logowanie e-mail, powiązanie wielu kart z jednym kontem) to
naturalny kolejny krok — model tokenów tego nie blokuje.

## Uruchomienie lokalnie

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

Aplikacja: http://localhost:3000

## Przydatne komendy

```bash
npm run dev            # serwer deweloperski
npm run build          # build produkcyjny
npm run start          # uruchomienie buildu
npx prisma studio      # podgląd bazy w przeglądarce
npx prisma migrate dev # nowa migracja po zmianie schema.prisma
```

## Przejście na Postgres

1. W `prisma/schema.prisma` zmień `provider` z `"sqlite"` na `"postgresql"`.
2. W `src/lib/db.ts` podmień adapter `@prisma/adapter-better-sqlite3` na `@prisma/adapter-pg`.
3. Ustaw `DATABASE_URL` na connection string Postgresa.
4. `npx prisma migrate deploy`

## Struktura

```
prisma/schema.prisma        model danych: Profile, Medication
src/lib/db.ts               klient Prisma (adapter SQLite)
src/lib/qr.ts               generowanie kodu QR (PNG / SVG)
src/lib/url.ts              budowanie bazowego URL aplikacji
src/app/actions.ts          server actions: create / save / delete
src/app/page.tsx            strona startowa
src/app/edit/[editToken]/   panel edycji + kod QR
src/app/k/[viewToken]/      publiczna strona ratunkowa
```

## Uwagi / do zrobienia

- **RODO**: dane o chorobach i lekach to szczególna kategoria danych osobowych.
  Przed publicznym uruchomieniem: polityka prywatności, zgoda użytkownika, hosting
  w UE, szyfrowanie w spoczynku, mechanizm usunięcia danych, retencja.
- Brak rate-limitingu na tworzenie profili.
- `npm audit` zgłasza podatności w zależnościach `qrcode` (transitive) — do przeglądu.
