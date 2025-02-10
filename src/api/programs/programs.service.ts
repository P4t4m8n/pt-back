import { prisma } from "../../../prisma/prisma";
import {
  TProgram,
  TProgramDto,
  TProgramFilter,
} from "../../types/program.type";

const save = async (dto: TProgramDto): Promise<TProgram> => {
  const { name, startDate, endDate, isActive, days, trainerId, traineeId, id } =
    dto;
  const program = await prisma.program.upsert({
    where: { id },
    update: {
      ...dto,
      name: name,
      startDate: startDate,
      endDate: endDate,
      traineeId: traineeId,
      trainerId: trainerId,
      days: days,
      isActive: isActive,
    },
    create: {
      ...dto,
      name: name,
      startDate: startDate,
      endDate: endDate,
      traineeId: traineeId,
      trainerId: trainerId,
      isActive: isActive,
      days: days,
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
  });

  return programs;
};

export const programService = { save, get };
