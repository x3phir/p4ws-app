-- AlterEnum
ALTER TYPE "ReportStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "adminNote" TEXT;
