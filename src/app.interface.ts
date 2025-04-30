export interface Valid {
  title: string;
}

export interface Invalid {
  title: string;
}

export interface Upload {
  valid: Valid[];
  invalid: Invalid[];
}
