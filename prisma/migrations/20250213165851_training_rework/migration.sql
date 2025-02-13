-- CreateEnum
CREATE TYPE "TrainingType" AS ENUM ('WARM_UP', 'STRETCH', 'CARDIO', 'STRENGTH');

-- AlterTable
ALTER TABLE "TraineeTraining" ADD COLUMN     "jointPain" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notes" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Training" ADD COLUMN     "bodyPart" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "defaultVideoId" TEXT,
ADD COLUMN     "imgUrl" TEXT,
ADD COLUMN     "trainingType" "TrainingType" NOT NULL DEFAULT 'STRENGTH';

-- AddForeignKey
ALTER TABLE "Training" ADD CONSTRAINT "Training_defaultVideoId_fkey" FOREIGN KEY ("defaultVideoId") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;
