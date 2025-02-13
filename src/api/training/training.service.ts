import { prisma } from "../../../prisma/prisma";
import {
  TTraining,
  TTrainingDto,
  TTrainingFilter,
} from "../../types/training.type";

const TRAINING_DETAILS_SELECT = {
  trainer: {
    select: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  },
  defaultSets: {
    select: {
      id: true,
      reps: true,
      rest: true,
      weight: true,
    },
  },
};
const get = async (filter: TTrainingFilter): Promise<TTraining[]> => {
  const trainings = await prisma.training.findMany({
    where: {
      trainerId: filter?.trainerId ? { equals: filter.trainerId } : undefined,
      name: filter?.name
        ? { contains: filter.name, mode: "insensitive" }
        : undefined,
    },
    select: {
      id: true,
      name: true,
      description: true,
      defaultSets: true,
      bodyPart: true,
    },
  });

  return trainings;
};

const getById = async (id: string): Promise<TTraining> => {
  const training = await prisma.training.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      ...TRAINING_DETAILS_SELECT,
    },
  });

  return training;
};

const create = async (dto: TTrainingDto): Promise<TTraining> => {
  const { name, description, trainerId, defaultSets } = dto;

  const training = await prisma.training.create({
    data: {
      name,
      description,
      trainerId,
      defaultSets: {
        createMany: {
          data: defaultSets,
        },
      },
    },
    include: {
      trainer: true,
      defaultSets: true,
    },
  });

  return training;
};

const update = async (dto: TTrainingDto): Promise<TTraining> => {
  const { name, description, trainerId, defaultSets, id } = dto;

  const updatedDefaultSetsIds = defaultSets
    .map((set) => set.id)
    .filter((id): id is string => Boolean(id));
  const training = await prisma.training.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      trainerId,
      defaultSets: {
        upsert: defaultSets.map((set) => ({
          where: { id: set.id },
          update: set,
          create: set,
        })),
        deleteMany: {
          id: {
            notIn: updatedDefaultSetsIds,
          },
        },
      },
    },
    include: {
      ...TRAINING_DETAILS_SELECT,
    },
  });
  return training;
};

export const trainingService = {
  get,
  create,
  getById,
  update,
};
