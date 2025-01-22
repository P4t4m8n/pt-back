import { TEntity } from "./app.type";
import { TPersonalTraining } from "./personal-training.type";
import { TSetHistory } from "./set.type";
import { TVideo } from "./video.type";

export type TTraineeTraining = TEntity & {
  date: Date;
  personalTraining: TPersonalTraining;
  sets: TSetHistory[];
  feedbackVideos: TVideo[];
};

export type TTraineeTrainingDto = TEntity &
  Omit<TTraineeTraining, "personalTraining"> & {
    personalTrainingId: string;
  };
