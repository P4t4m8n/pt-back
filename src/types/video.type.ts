import { VideoFormat, VideoOwner } from "@prisma/client";
import { TEntity } from "./app.type";

export type TVideo = TEntity & {
  duration: number;
  height: number;
  width: number;
  playbackUrl: string;
  url: string;
  assetId: string;
  format: VideoFormat;
  videoOwner: VideoOwner;
};

export type TVideoDto = TVideo & {
  trainerInstructionVideoId?: string;
  traineeFeedbackVideoId?: string;
};

export type TVideoFilter = {
  assetId?: string;
  format?: VideoFormat;
  traineeId?: string;
};
