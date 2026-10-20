import {
  IsBoolean,
  IsIn,
  IsOptional,
} from "class-validator";

export class UpdatePreferencesDto {
  @IsOptional()
  @IsBoolean()
  autoAtmosphereEnabled?: boolean;

  @IsOptional()
  @IsIn([
    "OFF",
    "AUTO",
    "MANUAL",
  ])
  atmosphereMode?:
    | "OFF"
    | "AUTO"
    | "MANUAL";

  @IsOptional()
  @IsBoolean()
  personalizationEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  pulseEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  memoryEnabled?: boolean;

  @IsOptional()
  @IsIn([
    "LOW",
    "BALANCED",
    "HIGH",
  ])
  discoveryLevel?:
    | "LOW"
    | "BALANCED"
    | "HIGH";

  @IsOptional()
  @IsBoolean()
  aiAssistantEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  reducedMotion?: boolean;

  @IsOptional()
  @IsBoolean()
  privateSessionDefault?: boolean;
}