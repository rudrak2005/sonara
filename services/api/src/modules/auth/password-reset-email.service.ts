import {
  Injectable,
  Logger,
} from "@nestjs/common";

type PasswordResetEmailInput = {
  email: string;
  resetUrl: string;
};

@Injectable()
export class PasswordResetEmailService {
  private readonly logger =
    new Logger(
      PasswordResetEmailService.name,
    );

  async send(
    input: PasswordResetEmailInput,
  ): Promise<void> {
    /*
     * Development email sandbox.
     *
     * Later this can be replaced by
     * Resend / SES / Postmark / another provider.
     */

    this.logger.log(
      [
        "----------------------------------------",
        "SONORA PASSWORD RESET EMAIL",
        `To: ${input.email}`,
        `Reset URL: ${input.resetUrl}`,
        "----------------------------------------",
      ].join("\n"),
    );
  }
}