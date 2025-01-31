import { prisma } from "../../../prisma/prisma";
import { TTraineeMetrics, TTraineeMetricsDto } from "../../types/trainee.type";
import { AppError } from "../../util/Error.util";

const save = async (dto: TTraineeMetricsDto): Promise<TTraineeMetrics> => {
  const { traineeId } = dto;
  
  if (!traineeId) throw AppError.create("Trainee ID is required", 400);


  const metric = await prisma.traineeMetrics.upsert({
    where: { id: dto?.id || "" },
    update: { ...dto, traineeId: traineeId },
    create: { ...dto, traineeId: traineeId },
  });

  return metric;
};

export const metricsService = {
  save,
};
