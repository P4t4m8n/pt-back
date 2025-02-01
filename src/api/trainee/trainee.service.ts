import { prisma } from "../../../prisma/prisma";
import {
  TTrainee,
  TTraineeCreateDto,
  TTraineeFilter,
} from "../../types/trainee.type";
import { USER_TRAINEE_INFO_SELECT } from "../user/user.select";

const get = async (filter: TTraineeFilter): Promise<TTrainee[]> => {
  const { email, firstName, lastName, phone } = filter;

  const trainees = await prisma.trainee.findMany({
    where: {
      trainerId: filter?.trainerId ? { equals: filter.trainerId } : undefined,
      user: {
        firstName: firstName
          ? { startsWith: firstName, mode: "insensitive" }
          : undefined,
        lastName: lastName
          ? { startsWith: lastName, mode: "insensitive" }
          : undefined,
        email: email ? { contains: email, mode: "insensitive" } : undefined,
        phone: phone ? { startsWith: phone } : undefined,
      },
    },
    select: {
      id: true,
      user: {
        select: {
          ...USER_TRAINEE_INFO_SELECT,
        },
      },
    },
    skip: filter.skip || 0,
    take: filter.take || 100,
  });

  return trainees;
};

const getById = async (traineeId: string): Promise<TTrainee> => {
  const trainee = await prisma.trainee.findUniqueOrThrow({
    relationLoadStrategy: "join",
    where: {
      id: traineeId,
    },
    include: {
      user: {
        select: {
          ...USER_TRAINEE_INFO_SELECT,
        },
      },
      metrics: {
        orderBy: {
          date: "desc",
        },
        take: 3,
      },
      programs: true,
      trainings: {
        include: {
          setsHistory: true,
          instructionVideos: true,
          training: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return trainee;
};
const create = async (dto: TTraineeCreateDto): Promise<string> => {
  const { id } = await prisma.trainee.create({
    data: {
      userId: dto.userId,
      trainerId: dto.trainerId,
      metrics: {
        create: {
          ...dto.metrics,
        },
      },
    },
  });

  return id;
};
export const traineeService = {
  get,
  getById,
  create,
};
