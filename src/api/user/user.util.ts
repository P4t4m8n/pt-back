import { TUserFilter } from "../../types/user.type";
import { sanitizeUtil } from "../../util/sanitize.util";

const sanitizeFilter = (filter: Partial<TUserFilter>): TUserFilter => {
  return {
    firstName: sanitizeUtil.SanitizedObjectField(filter?.firstName),
    lastName: sanitizeUtil.SanitizedObjectField(filter?.lastName),
    email: sanitizeUtil.SanitizedObjectField(filter?.email),
    phone: sanitizeUtil.SanitizedObjectField(filter?.phone),
    includeTrainers: filter?.includeTrainees ? true : undefined,
    includeTrainees: filter.includeTrainers ? true : undefined,
  };
};

export const userUtil = {
  sanitizeFilter,
};
