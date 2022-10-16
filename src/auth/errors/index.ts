export class UnauthorizedError extends Error {
  message: string;
  name: string;
  constructor(message?: string) {
    super(message);
    this.message = message;
    this.name = 'UnauthorizedError';
  }
}

export class DuplicateToken extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'DuplicateToken';
  }
}
