export class DuplicateEmail extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'DuplicateEmail';
  }
}
