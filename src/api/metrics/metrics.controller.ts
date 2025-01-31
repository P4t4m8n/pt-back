import { Request, Response } from "express";
import { AppError } from "../../util/Error.util";
import { metricsUtil } from "./metrics.util";
import { metricsService } from "./metrics.service";
export const saveMetrics = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const metricsDto = metricsUtil.sanitizeDto(data);

    const errors = metricsUtil.validateDto(metricsDto);
    if (errors.size) {
      const errorsString = Array.from(errors.values()).join(", ");
      AppError.create(`Validation Error - ${errorsString}`, 400);
      res.status(400).json({ errors });
      return;
    }

    const metrics = await metricsService.save(metricsDto);
    res.status(201).json(metrics);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
