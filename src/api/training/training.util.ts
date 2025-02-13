import { TTrainingDto, TTrainingFilter } from "../../types/training.type";
import { sanitizeUtil } from "../../util/sanitize.util";
import { setsUtil } from "../sets/sets.util";

const sanitizeDto = (dto: TTrainingDto): TTrainingDto => {
  const name = sanitizeUtil.SanitizedObjectField(dto?.name) || "";
  const description = sanitizeUtil.SanitizedObjectField(dto?.description) || "";

  const defaultSets = dto.defaultSets?.map((set) => setsUtil.sanitizeDto(set));

  const trainerId = sanitizeUtil.SanitizedObjectField(dto?.trainerId) || "";

  const bodyPart = sanitizeUtil.SanitizedObjectField(dto?.bodyPart) || "";

  return {
    name,
    description,
    defaultSets,
    trainerId,
    bodyPart,
  };
};
const sanitizeFilter = (filter: Partial<TTrainingFilter>): TTrainingFilter => {
  return {
    trainerId: sanitizeUtil.SanitizedObjectField(filter?.trainerId),
    name: sanitizeUtil.SanitizedObjectField(filter?.name),
  };
};

export const trainingUtil = {
  sanitizeFilter,
  sanitizeDto,
};
