import { prisma } from "../../../prisma/prisma";
import {
  TTraining,
  TTrainingDto,
  TTrainingFilter,
} from "../../types/training.type";

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
    },
  });

  return trainings;
};

const create = async (dto: TTrainingDto): Promise<TTraining> => {
  console.log("dto:", dto);
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

export const trainingService = {
  get,
  create,
};
