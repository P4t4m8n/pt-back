import { DaysOfWeek } from "@prisma/client";
import { TProgramDto, TProgramFilter } from "../../types/program.type";
import { sanitizeUtil } from "../../util/sanitize.util";
import { validationUtil } from "../../util/validation.util";

const sanitizeFilter = (): TProgramFilter => {
  return {};
};

const sanitizeDto = (dto: TProgramDto): TProgramDto => {
  const name = sanitizeUtil.SanitizedObjectField(dto?.name) || "";
  const startDate = dto?.startDate ? new Date(dto?.startDate) : new Date();
  const endDate = dto?.endDate ? new Date(dto?.endDate) : new Date();
  const isActive = sanitizeUtil.SanitizedBoolean(dto?.isActive);

  const traineeId = sanitizeUtil.SanitizedObjectField(dto?.traineeId) || null;
  const trainerId = sanitizeUtil.SanitizedObjectField(dto?.trainerId) || null;
  const id = sanitizeUtil.SanitizedObjectField(dto?.id) || undefined;

  const days =
    dto?.days?.map((day) => sanitizeUtil.SanitizedObjectField(day)) || [];

  return {
    name,
    startDate,
    endDate,
    isActive,
    days: days as DaysOfWeek[],
    traineeId,
    trainerId,
    id,
  };
};

const validateDto = (dto: TProgramDto): Record<keyof TProgramDto, string> => {
  const errorsMap = {} as Record<keyof TProgramDto, string>;

  const { name, startDate, endDate, days, trainerId, traineeId } = dto;

  const nameExistenceError = validationUtil.validateExistence("Name", name);
  if (nameExistenceError) {
    errorsMap.name = nameExistenceError;
  }

  const nameError = validationUtil.validateLetters("Name", name);
  if (nameError) {
    errorsMap.name = nameError;
  }

  const startDateError = validationUtil.validateDate("Start Date", startDate);
  if (startDateError) {
    errorsMap.startDate = startDateError;
  }

  const endDateError = validationUtil.validateDate("End Date", endDate);
  if (endDateError) {
    errorsMap.endDate = endDateError;
  }

  if (trainerId) {
    const trainerIdError = validationUtil.validateExistence(
      "Trainer ID",
      trainerId
    );
    if (trainerIdError) {
      errorsMap.trainerId = trainerIdError;
    }
  }

  const traineeIdError = validationUtil.validateExistence(
    "Trainee ID",
    traineeId
  );
  if (traineeIdError) {
    errorsMap.traineeId = traineeIdError;
  }
  const dayExistenceError = validationUtil.validateArrayLength("Days", days, 1);
  if (dayExistenceError) {
    errorsMap.days = dayExistenceError;
  }
  const daysError = days?.map((day, index) => {
    if (Object.values(DaysOfWeek).includes(day)) {
      return null;
    }

    return `Day at index ${index} value ${day} is invalid.`;
  });

  daysError?.forEach((error) => {
    if (error) {
      errorsMap.days += error + " ";
    }
  });

  return errorsMap;
};

export const programUtil = {
  sanitizeFilter,
  sanitizeDto,
  validateDto,
};
