import { TEntity } from "./app.type";
import { TTrainee } from "./trainee.type";
import { TTrainer } from "./trainer.type";

export type TUser = TEntity & {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  imgUrl?: string | null;
  trainer?: TTrainer | null;
  trainee?: TTrainee | null;
};

export type TUserUpdateDto = TEntity & {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  password?: string;
  imgUrl?: string;
  googleId?: string;
};

export type TUserCreateDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  password?: string;
  imgUrl?: string;
  googleId?: string;
};

export type TUserFilter = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  includeTrainers?: boolean;
  includeTrainees?: boolean;

};
