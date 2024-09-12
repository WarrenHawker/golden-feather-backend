export type ErrorReturn = {
  code: number;
  message: string;
  params?: string[];
  recaptchaScore?: number;
  stack?: string;
};
