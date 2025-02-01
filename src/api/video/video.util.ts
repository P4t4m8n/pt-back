import { VideoFormat } from "@prisma/client";
import { TVideoDto } from "../../types/video.type";
import { sanitizeUtil } from "../../util/sanitize.util";
import { validationUtil } from "../../util/validation.util";

const sanitizeDto = (dto: TVideoDto): TVideoDto => {
  const duration = +(sanitizeUtil.SanitizedObjectField(dto?.duration) || 0);
  const height = +(sanitizeUtil.SanitizedObjectField(dto?.height) || 0);
  const width = +(sanitizeUtil.SanitizedObjectField(dto?.width) || 0);
  const playbackUrl =
    sanitizeUtil.SanitizedObjectField(dto?.playbackUrl) || null;
  const url = sanitizeUtil.SanitizedObjectField(dto?.url) || "";
  const assetId = sanitizeUtil.SanitizedObjectField(dto?.assetId) || "";
  const format = sanitizeUtil.SanitizedObjectField(dto?.format) || "";

  const trainerInstructionVideoId =
    sanitizeUtil.SanitizedObjectField(dto?.trainerInstructionVideoId) ||
    undefined;
  const traineeTrainingId =
    sanitizeUtil.SanitizedObjectField(dto?.traineeTrainingId) || undefined;
  const id = sanitizeUtil.SanitizedObjectField(dto?.id) || "";

  return {
    duration,
    height,
    width,
    playbackUrl,
    url,
    assetId,
    format: format as VideoFormat,
    trainerInstructionVideoId,
    traineeTrainingId,
    id,
  };
};

const validateDto = (dto: TVideoDto): Record<keyof TVideoDto, string> => {
  const errorsMap = {} as Record<keyof TVideoDto, string>;

  const durationError = validationUtil.validateNumbers(
    "duration",
    dto.duration
  );
  if (durationError) errorsMap.duration = durationError;

  const heightError = validationUtil.validateNumbers("height", dto.height);
  if (heightError) errorsMap.height = heightError;

  const widthError = validationUtil.validateNumbers("width", dto.width);
  if (widthError) errorsMap.width = widthError;

  const playbackUrlError = validationUtil.validateExistence(
    "playbackUrl",
    dto.playbackUrl
  );
  if (playbackUrlError) errorsMap.playbackUrl = playbackUrlError;

  const urlError = validationUtil.validateExistence("url", dto.url);
  if (urlError) errorsMap.url = urlError;

  const assetIdError = validationUtil.validateExistence("assetId", dto.assetId);
  if (assetIdError) errorsMap.assetId = assetIdError;

  const formatError = validationUtil.validateExistence("format", dto.format);
  if (formatError) errorsMap.format = formatError;

  return errorsMap;
};

export const videoUtil = { sanitizeDto, validateDto };
