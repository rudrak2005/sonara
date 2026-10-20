import {
  IsBoolean,
} from "class-validator";

import {
  ApiProperty,
} from "@nestjs/swagger";

export class ResetHistoryDto {
  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  confirm!: boolean;
}