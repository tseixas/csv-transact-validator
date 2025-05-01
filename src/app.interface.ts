export interface ResponseOperation {
  from: string;
  to: string;
  amount: number;
  message: string;
}

export interface Upload {
  valid: ResponseOperation[];
  invalid: ResponseOperation[];
}
