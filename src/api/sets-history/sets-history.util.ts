import { SetType } from "@prisma/client";
import { TSetHistoryDto } from "../../types/set.type";
import { sanitizeUtil } from "../../util/sanitize.util";
import { setsUtil } from "../sets/sets.util";

const sanitizeDto = (dto: TSetHistoryDto): TSetHistoryDto => {
  const setType = sanitizeUtil.SanitizedObjectField(dto?.setType) || "";
  const date = sanitizeUtil.SanitizedObjectField(dto?.date?.toString()||"");
  const sets = dto.sets.map((set) => setsUtil.sanitizeDto(set));

  const id = sanitizeUtil.SanitizedObjectField(dto?.id) || "";

  return {
    setType: setType as SetType,
    date: new Date(date || ""),
    id,
    sets,
  };
};
const sanitizeFilter = () => {};

export const setsHistoryUtil = {
  sanitizeFilter,
  sanitizeDto,
};
