import {
  IsString,
  Length,
  MaxLength,
} from "class-validator";

export class PasswordResetConfirmDto {
  @IsString()
  @Length(32, 256)
  token!: string;

  @IsString()
  @Length(8, 128)
  @MaxLength(128)
  password!: string;
}