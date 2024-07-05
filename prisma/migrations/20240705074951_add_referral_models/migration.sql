/*
  Warnings:

  - You are about to drop the `Referral` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CREATED', 'PENDING', 'REFERRED');

-- DropTable
DROP TABLE "Referral";

-- CreateTable
CREATE TABLE "Referrer" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Referrer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referee" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "referrerEmail" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,

    CONSTRAINT "Referee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "referrerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralStatus" (
    "id" SERIAL NOT NULL,
    "referrerId" INTEGER NOT NULL,
    "refereeId" INTEGER,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Referrer_email_key" ON "Referrer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Referee_email_key" ON "Referee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_code_key" ON "ReferralCode"("code");

-- AddForeignKey
ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Referrer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralStatus" ADD CONSTRAINT "ReferralStatus_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Referrer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralStatus" ADD CONSTRAINT "ReferralStatus_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES "Referee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
