-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "reminderPreferences" TEXT[] DEFAULT ARRAY['15m', '30m', '60m']::TEXT[];
