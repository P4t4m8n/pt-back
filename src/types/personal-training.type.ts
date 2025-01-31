import { TEntity } from "./app.type";
import { TSetHistory, TSetHistoryDto } from "./set.type";
import { TTraineeTraining } from "./trainee-training.type";
import { TTraining } from "./training.type";
import { TVideo, TVideoDto } from "./video.type";

export type TPersonalTraining = TEntity & {
  training?: Omit<TTraining, "defaultSets">;
  instructionVideos?: TVideo[];
  instructions?: string;
  sets?: TSetHistory[]|null;
  traineeTraining?: TTraineeTraining[];
};

export type TPersonalTrainingDto = TEntity &
  Omit<
    TPersonalTraining,
    "training" | "traineeTraining" | "instructionVideos" | "sets"
  > & {
    trainingId: string;
    programId?: string;
    traineeId: string;
    instructionVideos: TVideoDto[];
    sets: TSetHistoryDto[];
  };

export type TPersonalTrainingFilter = {
  traineeId?: string;
  trainingId?: string;
  programId?: string;
  skip?: number;
  take?: number;
};
