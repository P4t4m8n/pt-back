import { prisma } from "../../../prisma/prisma";
import {
  TPersonalTraining,
  TPersonalTrainingDto,
} from "../../types/personal-training.type";

// const save = async (dto: TPersonalTrainingDto): Promise<TPersonalTraining> => {
//   const { traineeId, trainingId, sets, instructionVideos, id } = dto;

//   const updatedSetsIds = sets!
//     .map((set) => set?.id)
//     .filter((id): id is string => Boolean(id));
//   const training = await prisma.training.update({
//     where: {
//       id,
//     },
//     data: {
//       name,
//       description,
//       trainerId,
//       defaultSets: {
//         upsert: defaultSets.map((set) => ({
//           where: { id: set.id },
//           update: set,
//           create: set,
//         })),
//         deleteMany: {
//           id: {
//             notIn: updatedSetsIds,
//           },
//         },
//       },
//     },
//     include: {
//       ...TRAINING_DETAILS_SELECT,
//     },
//   });
//   return training;
// };

const create = async (
  dto: TPersonalTrainingDto
): Promise<TPersonalTraining> => {
  const {
    traineeId,
    trainingId,
    setsHistory,
    instructionVideos,
    instructions,
  } = dto;

  const pt = await prisma.personalTraining.create({
    data: {
      traineeId,
      trainingId,
      instructions,
      instructionVideos: {
        connect: instructionVideos.map((video) => ({ id: video.id })),
      },
      setsHistory: {
        create: setsHistory.map((history) => ({
          date: history.date,
          setType: history.setType,
          sets: {
            create: history.sets?.map((set) => ({
              reps: set.reps,
              weight: set.weight,
              rest: set.rest,
            })),
          },
        })),
      },
    },
    include: {
      instructionVideos: true,
      setsHistory: {
        include: {
          sets: true,
        },
      },
    },
  });

  return pt;
};

export const personalTrainingService = {
  create,
};
