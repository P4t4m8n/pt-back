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
  user?: TUser|null;
};

export type TTraineeDto = TEntity & {
  userId: string;
  trainerId?: string;
};

export type TTraineeCreateDto = {
  userDto: TUserCreateDto;
  trainerId: string;
  metricsDto?: TTraineeMetricsDto;
};

export type TTraineeFilter = {
  firstName?: string;
  lastName?: string;
  email?: string;
  trainerId?: string;
  phone?: string;
  skip?: number;
  take?: number;
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
