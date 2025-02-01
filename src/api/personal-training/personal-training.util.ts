import { TPersonalTrainingDto } from "../../types/personal-training.type";
import { sanitizeUtil } from "../../util/sanitize.util";
import { validationUtil } from "../../util/validation.util";
import { setsHistoryUtil } from "../sets-history/sets-history.util";
import { videoUtil } from "../video/video.util";

const sanitizeDto = (dto: TPersonalTrainingDto): TPersonalTrainingDto => {
  const instructions =
    sanitizeUtil.SanitizedObjectField(dto?.instructions) || "";
  const trainingId = sanitizeUtil.SanitizedObjectField(dto?.trainingId) || "";
  const programId = sanitizeUtil.SanitizedObjectField(dto?.programId) || undefined;

  const traineeId = sanitizeUtil.SanitizedObjectField(dto?.traineeId) || "";
  const id = sanitizeUtil.SanitizedObjectField(dto?.id) || undefined;
  const setsHistory = dto.setsHistory.map((setHistory) =>
    setsHistoryUtil.sanitizeDto(setHistory)
  );

  const instructionVideos = dto.instructionVideos.map((video) =>
    videoUtil.sanitizeDto(video)
  );

  return {
    instructions,
    trainingId,
    programId,
    traineeId,
    setsHistory,
    instructionVideos,
    id,
  };
};

const validateDto = (
  dto: TPersonalTrainingDto
): Record<keyof TPersonalTrainingDto, string> => {
  const errorsMap = {} as Record<keyof TPersonalTrainingDto, string>;

  const instructionsError = validationUtil.validateLettersAndNumbers(
    "instructions",
    dto?.instructions
  );
  if (instructionsError) errorsMap.instructions = instructionsError;

  const trainingIdError = validationUtil.validateExistence(
    "trainingId",
    dto.trainingId
  );
  if (trainingIdError) errorsMap.trainingId = trainingIdError;

  const traineeIdIdError = validationUtil.validateExistence(
    "traineeId",
    dto.traineeId
  );
  if (traineeIdIdError) errorsMap.traineeId = traineeIdIdError;

  return errorsMap;
};

export const personalTrainingUtil = { sanitizeDto,validateDto };
