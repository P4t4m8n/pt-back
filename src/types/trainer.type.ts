import { Trainee } from "@prisma/client";
import { TEntity } from "./app.type";
import { TProgram } from "./program.type";
import { TUser, TUserCreateDto, TUserUpdateDto } from "./user.type";

export type TTrainer = TEntity & {
  trainees?: Trainee[];
  programs?: TProgram[];
  user?: TUser|null;
};
export type TTrainerDto = TEntity & {
  userDto: TUserUpdateDto | TUserCreateDto;
};
