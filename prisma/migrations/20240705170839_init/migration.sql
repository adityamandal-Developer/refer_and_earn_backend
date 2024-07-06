/*
  Warnings:

  - The primary key for the `Referee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ReferralStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Referrer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[referralCodeId]` on the table `ReferralStatus` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referralCodeId` to the `ReferralStatus` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ReferralCode" DROP CONSTRAINT "ReferralCode_referrerId_fkey";

-- DropForeignKey
ALTER TABLE "ReferralStatus" DROP CONSTRAINT "ReferralStatus_refereeId_fkey";

-- DropForeignKey
ALTER TABLE "ReferralStatus" DROP CONSTRAINT "ReferralStatus_referrerId_fkey";

-- AlterTable
ALTER TABLE "Referee" DROP CONSTRAINT "Referee_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Referee_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Referee_id_seq";

-- AlterTable
ALTER TABLE "ReferralCode" ALTER COLUMN "referrerId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ReferralStatus" DROP CONSTRAINT "ReferralStatus_pkey",
ADD COLUMN     "referralCodeId" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "referrerId" SET DATA TYPE TEXT,
ALTER COLUMN "refereeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ReferralStatus_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ReferralStatus_id_seq";

-- AlterTable
ALTER TABLE "Referrer" DROP CONSTRAINT "Referrer_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Referrer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Referrer_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "ReferralStatus_referralCodeId_key" ON "ReferralStatus"("referralCodeId");

-- AddForeignKey
ALTER TABLE "ReferralStatus" ADD CONSTRAINT "ReferralStatus_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Referrer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralStatus" ADD CONSTRAINT "ReferralStatus_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES "Referee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralStatus" ADD CONSTRAINT "ReferralStatus_referralCodeId_fkey" FOREIGN KEY ("referralCodeId") REFERENCES "ReferralCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Referrer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
