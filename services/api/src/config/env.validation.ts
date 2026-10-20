import { plainToInstance } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from "class-validator";

class EnvironmentVariables {
  @IsOptional()
  @IsIn([
    "development",
    "test",
    "production",
  ])
  NODE_ENV?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT?: number;

  @IsOptional()
  @IsString()
  WEB_ORIGIN?: string;

  @IsOptional()
  @IsString()
  LOG_LEVEL?: string;
}

export function validateEnvironment(
  config: Record<string, unknown>,
) {
  const validated =
    plainToInstance(
      EnvironmentVariables,
      config,
      {
        enableImplicitConversion: true,
      },
    );

  const errors = validateSync(
    validated,
    {
      skipMissingProperties: true,
    },
  );

  if (errors.length > 0) {
    const messages =
      errors.flatMap(
        (error) =>
          Object.values(
            error.constraints ?? {},
          ),
      );

    throw new Error(
      `Invalid environment configuration: ${messages.join(
        "; ",
      )}`,
    );
  }

  return validated;
}