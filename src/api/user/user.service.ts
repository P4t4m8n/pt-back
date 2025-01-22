import { prisma } from "../../../prisma/prisma";
import { TUser } from "../../types/user.type";

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

export const userService = {
  getById,
};
