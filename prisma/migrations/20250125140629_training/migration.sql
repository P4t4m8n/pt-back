-- CreateEnum
CREATE TYPE "DaysOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "AuthStatus" AS ENUM ('PENDING', 'SENT', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VideoOwner" AS ENUM ('USER', 'TRAINER');

-- CreateEnum
CREATE TYPE "VideoFormat" AS ENUM ('MP4', 'MOV', 'AVI', 'FLV', 'WMV', 'MKV', 'WEBM');

-- CreateEnum
CREATE TYPE "SetType" AS ENUM ('DEFAULT', 'USER_HISTORY', 'TRAINER', 'TRAINER_HISTORY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT,
    "googleIdHash" TEXT,
    "imgUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trainee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trainerId" TEXT,

    CONSTRAINT "Trainee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TraineeMetrics" (
    "id" TEXT NOT NULL,
    "traineeId" TEXT NOT NULL,
    "heartRate" INTEGER,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "age" DOUBLE PRECISION,
    "bloodPressureSystole" INTEGER,
    "bloodPressureDiastole" INTEGER,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TraineeMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trainer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Trainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Program',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "days" "DaysOfWeek"[],
    "traineeId" TEXT,
    "trainerId" TEXT,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Training" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "trainerId" TEXT,

    CONSTRAINT "Training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Set" (
    "id" TEXT NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "rest" INTEGER NOT NULL,
    "trainingId" TEXT,
    "setHistoryId" TEXT,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetHistory" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "personalTrainingId" TEXT,
    "traineeTrainingId" TEXT,
    "setType" "SetType" NOT NULL,

    CONSTRAINT "SetHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalTraining" (
    "id" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "programId" TEXT,
    "traineeId" TEXT NOT NULL,
    "instructions" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "PersonalTraining_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TraineeTraining" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "personalTrainingId" TEXT NOT NULL,

    CONSTRAINT "TraineeTraining_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "playbackUrl" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "format" "VideoFormat" NOT NULL,
    "videoOwner" "VideoOwner" NOT NULL DEFAULT 'TRAINER',
    "trainerInstructionVideoId" TEXT,
    "traineeTrainingId" TEXT,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Trainee_userId_key" ON "Trainee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_userId_key" ON "Trainer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalTraining_trainingId_key" ON "PersonalTraining"("trainingId");

-- AddForeignKey
ALTER TABLE "Trainee" ADD CONSTRAINT "Trainee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trainee" ADD CONSTRAINT "Trainee_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraineeMetrics" ADD CONSTRAINT "TraineeMetrics_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "Trainee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trainer" ADD CONSTRAINT "Trainer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "Trainee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Training" ADD CONSTRAINT "Training_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_setHistoryId_fkey" FOREIGN KEY ("setHistoryId") REFERENCES "SetHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetHistory" ADD CONSTRAINT "SetHistory_personalTrainingId_fkey" FOREIGN KEY ("personalTrainingId") REFERENCES "PersonalTraining"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetHistory" ADD CONSTRAINT "SetHistory_traineeTrainingId_fkey" FOREIGN KEY ("traineeTrainingId") REFERENCES "TraineeTraining"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalTraining" ADD CONSTRAINT "PersonalTraining_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalTraining" ADD CONSTRAINT "PersonalTraining_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalTraining" ADD CONSTRAINT "PersonalTraining_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "Trainee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraineeTraining" ADD CONSTRAINT "TraineeTraining_personalTrainingId_fkey" FOREIGN KEY ("personalTrainingId") REFERENCES "PersonalTraining"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_trainerInstructionVideoId_fkey" FOREIGN KEY ("trainerInstructionVideoId") REFERENCES "PersonalTraining"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_traineeTrainingId_fkey" FOREIGN KEY ("traineeTrainingId") REFERENCES "TraineeTraining"("id") ON DELETE SET NULL ON UPDATE CASCADE;
