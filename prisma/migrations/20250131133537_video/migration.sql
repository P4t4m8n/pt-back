-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "duration" SET DEFAULT 0,
ALTER COLUMN "height" SET DEFAULT 0,
ALTER COLUMN "width" SET DEFAULT 0,
ALTER COLUMN "playbackUrl" DROP NOT NULL;
