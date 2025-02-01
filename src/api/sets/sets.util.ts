import { TSetDto } from "../../types/set.type";
import { sanitizeUtil } from "../../util/sanitize.util";

const sanitizeDto = (dto: TSetDto): TSetDto => {
  const reps = +(sanitizeUtil.SanitizedObjectField(dto?.reps) || 0);
  const weight = +(sanitizeUtil.SanitizedObjectField(dto?.weight) || 0);
  const rest = +(sanitizeUtil.SanitizedObjectField(dto?.rest) || 0);

  const trainingId = sanitizeUtil.SanitizedObjectField(dto?.trainingId) || "";
  const setHistoryId =
    sanitizeUtil.SanitizedObjectField(dto?.trainingId) || undefined;

  return {
    reps,
    weight,
    rest,
    trainingId,
    setHistoryId,
  };
};
const sanitizeFilter = () => {};

export const setsUtil = {
  sanitizeFilter,
  sanitizeDto,
};
