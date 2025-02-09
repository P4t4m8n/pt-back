import { prisma } from "../../../prisma/prisma";
import {
  TProgram,
  TProgramDto,
  TProgramFilter,
} from "../../types/program.type";

//Only use AFTER validation
//TODO split dto to before and after validation
const save = async (dto: TProgramDto): Promise<TProgram> => {
  const { name, startDate, endDate, isActive, days, trainerId, traineeId } =
    dto;
  const program = await prisma.program.upsert({
    where: { id: dto?.id || "" },
    update: {
      ...dto,
      name: name!,
      startDate: startDate!,
      endDate: endDate!,
      traineeId: traineeId!,
      trainerId: trainerId!,
      days: days!,
    },
    create: {
      ...dto,
      name: name!,
      startDate: startDate!,
      endDate: endDate!,
      traineeId: traineeId!,
      trainerId: trainerId!,
      isActive: isActive!,
      days: days!,
    },
  });

  return program;
};

const get = async (filter: TProgramFilter): Promise<TProgram[]> => {
  const { name, startDate, endDate, isActive, traineeId, trainerId } = filter;

  const programs = await prisma.program.findMany({
    where: {
      OR: [
        { name: { contains: name } },
        { startDate: { gte: startDate } },
        { endDate: { lte: endDate } },
        { isActive },
        { traineeId },
        { trainerId },
      ],
    },

    include: {
      trainings: true,
    },
  });

  return programs;
};

export const programService = { save, get };
