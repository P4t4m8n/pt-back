import { TTraineeDto, TTraineeFilter } from "../../types/trainee.type";
import { sanitizeUtil } from "../../util/sanitize.util";
import { validationUtil } from "../../util/validation.util";

const sanitizeFilter = (filter: Partial<TTraineeFilter>): TTraineeFilter => {
  return {
    trainerId: sanitizeUtil.SanitizedObjectField(filter?.trainerId),
    firstName: sanitizeUtil.SanitizedObjectField(filter?.firstName),
    lastName: sanitizeUtil.SanitizedObjectField(filter?.lastName),
    email: sanitizeUtil.SanitizedObjectField(filter?.email),
    phone: sanitizeUtil.SanitizedObjectField(filter?.phone),
  };
};

const sanitizeDto = (dto: TTraineeDto): TTraineeDto => {
  const { trainerId, userId, metrics } = dto;
  //TODO build a master trainer and move credentials into env. this ID is temporary
  const masterTrainer = "f12614e1-98c9-4e54-97e0-0d58c331b450";

  const _sanitizedDto: TTraineeDto = {
    trainerId: sanitizeUtil.SanitizedObjectField(trainerId) || masterTrainer,
    userId: sanitizeUtil.SanitizedObjectField(userId) || "",
  };

  if (metrics) {
    const _metricsDto = {
      heartRate: +(sanitizeUtil.SanitizedObjectField(metrics?.heartRate) || 0),
      weight: +(sanitizeUtil.SanitizedObjectField(metrics.weight) || 0),
      height: +(sanitizeUtil.SanitizedObjectField(metrics.height) || 0),
      age: +(sanitizeUtil.SanitizedObjectField(metrics.age) || 0),
      bloodPressureSystole: +(
        sanitizeUtil.SanitizedObjectField(metrics.bloodPressureSystole) || 0
      ),
      bloodPressureDiastole: +(
        sanitizeUtil.SanitizedObjectField(metrics.bloodPressureDiastole) || 0
      ),
      date: metrics.date ? new Date(metrics.date) : new Date(),
    };
    _sanitizedDto.metrics = _metricsDto;
  }
  return _sanitizedDto;
};

const validateDto = (dto: TTraineeDto): string[] => {
  const errors = [];
  const userIdError = validationUtil.validateExistence("userId", dto.userId);
  if (userIdError) {
    errors.push(userIdError);
  }
  const trainerIdError = validationUtil.validateExistence(
    "trainerId",
    dto.trainerId
  );
  if (trainerIdError) {
    errors.push(trainerIdError);
  }

  return errors;
};

export const traineeUtil = {
  sanitizeFilter,
  sanitizeDto,
  validateDto,
};
