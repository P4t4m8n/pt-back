import { TTraineeMetricsDto } from "../../types/trainee.type";
import { sanitizeUtil } from "../../util/sanitize.util";
import { validationUtil } from "../../util/validation.util";

const sanitizeDto = (dto: TTraineeMetricsDto): TTraineeMetricsDto => {
  const heartRate = +(sanitizeUtil.SanitizedObjectField(dto?.heartRate) || 0);
  const weight = +(sanitizeUtil.SanitizedObjectField(dto?.weight) || 0);
  const height = +(sanitizeUtil.SanitizedObjectField(dto?.height) || 0);
  const age = +(sanitizeUtil.SanitizedObjectField(dto?.age) || 0);
  const bloodPressureSystole = +(
    sanitizeUtil.SanitizedObjectField(dto?.bloodPressureSystole) || 0
  );
  const bloodPressureDiastole = +(
    sanitizeUtil.SanitizedObjectField(dto?.bloodPressureDiastole) || 0
  );
  const date = new Date(dto?.date || new Date());

  const traineeId = sanitizeUtil.SanitizedObjectField(dto?.traineeId) || null;
  const id = sanitizeUtil.SanitizedObjectField(dto?.id) || undefined;

  return {
    heartRate,
    weight,
    height,
    age,
    bloodPressureSystole,
    bloodPressureDiastole,
    date,
    traineeId,
    id,
  };
};

const validateDto = (
  dto: TTraineeMetricsDto
): Map<keyof TTraineeMetricsDto, string> => {
  console.log("dto:", dto)
  const errorsMap = new Map<keyof TTraineeMetricsDto, string>();

  const {
    heartRate,
    weight,
    height,
    age,
    bloodPressureSystole,
    bloodPressureDiastole,
    date,
    traineeId,
  } = dto;

  const heartRateError = validationUtil.validateNumbers(
    "Heart Rate",
    heartRate
  );
  console.log("heartRateError:", heartRateError)

  if (heartRateError) {
    errorsMap.set("heartRate", heartRateError);
  }

  const weightError = validationUtil.validateNumbers("Weight", weight);

  if (weightError) {
    errorsMap.set("weight", weightError);
  }

  const heightError = validationUtil.validateNumbers("Height", height);

  if (heightError) {
    errorsMap.set("height", heightError);
  }

  const ageError = validationUtil.validateNumbers("Age", age);

  if (ageError) {
    errorsMap.set("age", ageError);
  }

  const bloodPressureSystoleError = validationUtil.validateNumbers(
    "Blood Pressure Systole",
    bloodPressureSystole
  );

  if (bloodPressureSystoleError) {
    errorsMap.set("bloodPressureSystole", bloodPressureSystoleError);
  }

  const bloodPressureDiastoleError = validationUtil.validateNumbers(
    "Blood Pressure Diastole",
    bloodPressureDiastole
  );

  if (bloodPressureDiastoleError) {
    errorsMap.set("bloodPressureDiastole", bloodPressureDiastoleError);
  }

  const dateError = validationUtil.validateDate("Date", date);

  if (dateError) {
    errorsMap.set("date", dateError);
  }

  const traineeIdError = validationUtil.validateExistence(
    "Trainee Id",
    traineeId
  );

  if (traineeIdError) {
    errorsMap.set("traineeId", traineeIdError);
  }

  return errorsMap;
};

export const metricsUtil = { sanitizeDto, validateDto };
