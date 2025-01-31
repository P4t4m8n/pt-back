import { VideoFormat, VideoOwner } from "@prisma/client";
import { TEntity } from "./app.type";

export type TVideo = TEntity & {
  duration?: number;
  height?: number;
  width?: number;
  playbackUrl?: string|null;
  url: string;
  assetId: string;
  format: VideoFormat;
};

export type TVideoDto = TVideo & {
  trainerInstructionVideoId?: string;
  traineeTrainingId?: string;
};

export type TVideoFilter = {
  assetId?: string;
  format?: VideoFormat;
  traineeId?: string;
};
