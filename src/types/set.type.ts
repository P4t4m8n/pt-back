import { SetType } from "@prisma/client";
import { TEntity } from "./app.type";
import { TPersonalTraining } from "./personal-training.type";
import { TTraineeTraining } from "./trainee-training.type";

export type TSet = TEntity & {
  reps: number;
  weight: number;
  rest: number;
};

export type TSetDto = TSet & {
  trainingId?: string;
  setHistoryId?: string;
};

export type TSetHistory = TEntity & {
  date: Date;
  personalTraining?: TPersonalTraining;
  traineeTraining?: TTraineeTraining;
  setType: SetType;
  sets?: TSet[]|null;
};
export type TSetHistoryDto = Omit<
  TSetHistory,
  "personalTraining" | "traineeTraining"
> & {
  date: Date;

};

export type TSetFilter = {
  reps?: number;
  weight?: number;
  rest?: number;
  setType?: SetType;
  trainingId?: string;
  traineeSetsId?: string;
  trainerSetsId?: string;
};
