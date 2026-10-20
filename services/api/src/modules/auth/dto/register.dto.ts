import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
} from "class-validator";

export class RegisterDto {
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @Length(8, 128)
  password!: string;

  @IsOptional()
  @IsString()
  @Length(2, 80)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  timezone?: string;
}