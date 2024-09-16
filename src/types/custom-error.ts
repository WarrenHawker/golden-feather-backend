export class CustomError extends Error {
  public statusCode: number;
  public params: string[] | null;
  public detailedMessage: string | null;
  public recaptchaScore: number | null;

  constructor(
    message: string,
    statusCode: number,
    detailedMessage: string | null = null,
    params: string[] | null = null,
    recaptchaScore: number | null = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.params = params;
    this.detailedMessage = detailedMessage;
    this.recaptchaScore = recaptchaScore;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
