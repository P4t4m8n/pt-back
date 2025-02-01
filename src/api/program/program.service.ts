import { prisma } from "../../../prisma/prisma";
import { TProgram, TProgramDto } from "../../types/program.type";

//Only use AFTER validation
//TODO split dto to before ann after validation
const save = async (dto: TProgramDto): Promise<TProgram> => {
  const { name, startDate, endDate, isActive, days, trainerId, traineeId } =
    dto;
  const program = await prisma.program.upsert({
    where: { id: dto?.id|| ""  },
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

export const programService = {save};
