import {
  IsEmail,
  IsString,
  MaxLength,
} from "class-validator";

export class PasswordResetRequestDto {
  @IsString()
  @IsEmail()
  @MaxLength(254)
  email!: string;
}