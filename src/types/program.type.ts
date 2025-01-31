import { DaysOfWeek } from "@prisma/client";
import { TEntity } from "./app.type";
import { TPersonalTraining } from "./personal-training.type";
import { TTrainer } from "./trainer.type";
import { TTrainee } from "./trainee.type";

export type TProgram = TEntity & {
  name?: string | null;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  isActive?: boolean;
  days?: DaysOfWeek[];
  trainings?: TPersonalTraining[];
  trainee?: TTrainee | null;
  trainer?: TTrainer | null;
};

export type TProgramDto = TEntity &
  Omit<TProgram, "trainings" | "trainee" | "trainer"> & {
    traineeId?: string | null;
    trainerId?: string | null;
  };
export type TProgramFilter = {
  name?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  traineeId?: string;
  trainerId?: string;
};
