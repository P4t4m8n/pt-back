import { TrainingType } from "@prisma/client";
import { TEntity } from "./app.type";
import { TSet, TSetDto } from "./set.type";
import { TTrainer } from "./trainer.type";
import { TVideo } from "./video.type";

export type TTraining = TEntity & {
  name: string;
  defaultSets?: TSet[];
  description?: string;
  trainer?: TTrainer | null;
  bodyPart: string;
  imgUrl?: string|null;
  defaultVideo?: TVideo | null;
  trainingType?: TrainingType;
};

export type TTrainingDto = Omit<
  TTraining,
  "trainer" | "defaultSets" | "defaultVideo"
> & {
  trainerId: string;
  defaultVideoId?: string;
  defaultSets: TSetDto[];
};

export type TTrainingFilter = {
  trainerId?: string | null;
  name?: string | null;
  skip?: number;
  take?: number;
};
