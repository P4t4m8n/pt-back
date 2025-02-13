import { prisma } from "../../../prisma/prisma";
import {
  TPersonalTraining,
  TPersonalTrainingDto,
} from "../../types/personal-training.type";

const update = async (
  dto: TPersonalTrainingDto
): Promise<TPersonalTraining> => {
  const {
    traineeId,
    trainingId,
    setsHistory,
    instructionVideos,
    instructions,
    id,
    programId,
  } = dto;

  const updatedSetsIds = setsHistory!
    .map((set) => set?.id)
    .filter((id): id is string => Boolean(id));
  const newVideoIds = instructionVideos.map((video) => video.id!);

  const [training] = await prisma.$transaction([
    prisma.personalTraining.update({
      where: {
        id,
      },
      data: {
        trainingId,
        programId,
        traineeId,
        instructions,
        setsHistory: {
          upsert: setsHistory.map((set) => ({
            where: { id: set.id || "" },
            update: {
              date: set.date,
              setType: set.setType,
              sets: {
                upsert: set.sets?.map((s) => ({
                  where: { id: s.id || "" },
                  update: {
                    reps: s.reps,
                    weight: s.weight,
                    rest: s.rest,
                  },
                  create: {
                    reps: s.reps,
                    weight: s.weight,
                    rest: s.rest,
                  },
                })),
              },
            },
            create: {
              date: set.date,
              setType: set.setType,
              sets: {
                create: set.sets?.map((s) => ({
                  reps: s.reps,
                  weight: s.weight,
                  rest: s.rest,
                })),
              },
            },
          })),
          deleteMany: {
            id: {
              notIn: updatedSetsIds,
            },
          },
        },
        instructionVideos: {
          set: newVideoIds.map((id) => ({ id })),
        },
      },
      include: {
        setsHistory: true,
        instructionVideos: true,
        training: {
          select: {
            name: true,
            bodyPart: true,
          },
        },
      },
    }),
    // Get all instruction videos related to this training that aren't in the new set
    prisma.video.deleteMany({
      where: {
        AND: [{ trainerInstructionVideoId: id, id: { notIn: newVideoIds } }],
      },
    }),
  ]);
  return training;
};

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
  update,
};
