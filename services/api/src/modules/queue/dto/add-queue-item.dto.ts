import { IsUUID } from "class-validator";

export class AddQueueItemDto {
  @IsUUID()
  musicItemId!: string;
}
