-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "viewToken" TEXT NOT NULL,
    "editToken" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthYear" INTEGER,
    "bloodType" TEXT,
    "conditions" TEXT NOT NULL DEFAULT '',
    "allergies" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "emergencyName" TEXT NOT NULL DEFAULT '',
    "emergencyPhone" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dose" TEXT NOT NULL DEFAULT '',
    "frequency" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Medication_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_viewToken_key" ON "Profile"("viewToken");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_editToken_key" ON "Profile"("editToken");

-- CreateIndex
CREATE INDEX "Medication_profileId_idx" ON "Medication"("profileId");
