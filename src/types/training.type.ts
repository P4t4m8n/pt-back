import { TEntity } from "./app.type";
import { TSet } from "./set.type";

export type TTraining = TEntity & {
  name: string;
  defaultSets: TSet[];
  description?: string;
};

export type TTrainingFilter = {
  set?: number;
  name?: string;
  skip?: number;
  take?: number;
};
