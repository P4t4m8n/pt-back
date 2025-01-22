import { TEntity } from "./app.type";
import { TSetHistory } from "./set.type";
import { TTraineeTraining } from "./trainee-training.type";
import { TTraining } from "./training.type";
import { TVideo } from "./video.type";

export type TPersonalTraining = TEntity & {
  training?: Omit<TTraining, "defaultSets">;
  instructionVideos?: TVideo[];
  instructions?: string;
  sets?: TSetHistory[];
  traineeTraining?: TTraineeTraining[];
};

export type TPersonalTrainingDto = TEntity &
  Omit<TPersonalTraining, "training"> & {
    trainingId: string;
    programId?: string;
    traineeId: string;
  };

export type TPersonalTrainingFilter = {
  traineeId?: string;
  trainingId?: string;
  programId?: string;
  skip?: number;
  take?: number;
};
