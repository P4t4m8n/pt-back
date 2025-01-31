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
  console.log("dto:", dto)
  const { traineeId, trainingId, sets, instructionVideos } = dto;

  const pt = await prisma.personalTraining.create({
    data: {
      traineeId,
      trainingId,
      instructionVideos: {
        createMany: {
          data: instructionVideos,
        },
      },
      sets: {
        createMany: {
          data: sets,
        },
      },
    },
    include: {
      instructionVideos: true,
      sets: {
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
