import { prisma } from "../../../prisma/prisma";
import { TUser, TUserFilter } from "../../types/user.type";
import { USER_TRAINEE_INFO_SELECT } from "./user.select";

const getById = async (id: string): Promise<TUser> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      imgUrl: true,
      trainer: true,
      trainee: true,
    },
  });

  return user;
};

const get = async (filter: TUserFilter): Promise<TUser[]> => {
  const {
    email,
    phone,
    firstName,
    lastName,
    includeTrainers = false,
    includeTrainees = true,
  } = filter;
  const users = await prisma.user.findMany({
    where: {
      firstName: firstName
        ? { startsWith: firstName, mode: "insensitive" }
        : undefined,
      lastName: lastName
        ? { startsWith: lastName, mode: "insensitive" }
        : undefined,
      email: email ? { contains: email } : undefined,
      phone: phone ? { startsWith: phone } : undefined,
      NOT: [
        ...(includeTrainees ? [{ trainee: { isNot: null } }] : []),
        ...(!includeTrainers ? [{ trainer: { isNot: null } }] : []),
      ],
    },
    select: {
      ...USER_TRAINEE_INFO_SELECT,
      trainee: {
        select: {
          id: true,
        },
      },
      trainer: {
        select: {
          id: true,
        },
      },
    },
  });

  return users;
};

export const userService = {
  getById,
  get,
};
