import { TEntity } from "./app.type";
import { TPersonalTraining } from "./personal-training.type";
import { TProgram } from "./program.type";
import { TTrainer } from "./trainer.type";
import { TUser, TUserCreateDto } from "./user.type";

export type TTrainee = TEntity & {
  programs?: TProgram[];
  trainings?: TPersonalTraining[];
  trainer?: Omit<TTrainer, "trainee" | "programs">;
  metrics?: TTraineeMetrics[];
  user?: TUser | null;
};

export type TTraineeDto = TEntity & TTraineeCreateDto & {};

export type TTraineeCreateDto = {
  userId: string;
  trainerId: string;
  metrics?: TTraineeMetricsDto;
};

export type TTraineeFilter = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  trainerId?: string | null;
  phone?: string | null;
  skip?: number | null;
  take?: number | null;
};

export type TTraineeMetrics = TEntity & {
  heartRate?: number | null;
  weight?: number | null;
  height?: number | null;
  age?: number | null;
  bloodPressureSystole?: number | null;
  bloodPressureDiastole?: number | null;
  date?: Date;
};

export type TTraineeMetricsDto = TTraineeMetrics & {
  traineeId?: string;
};

export type TTraineeMetricsFilter = {
  traineeId?: string;
};
