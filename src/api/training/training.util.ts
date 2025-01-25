import { TTrainingFilter } from "../../types/training.type";
import { sanitizeUtil } from "../../util/sanitize.util";

const sanitizeFilter = (filter: Partial<TTrainingFilter>): TTrainingFilter => {
  return {
    trainerId: sanitizeUtil.SanitizedObjectField(filter?.trainerId),
    name: sanitizeUtil.SanitizedObjectField(filter?.name),
  };
};

export const trainingUtil = {
  sanitizeFilter,
};
