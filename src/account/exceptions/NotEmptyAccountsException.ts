export class NotEmptyAccountsException extends Error {
  constructor() {
    super('Should remain at least one account');
  }
}
