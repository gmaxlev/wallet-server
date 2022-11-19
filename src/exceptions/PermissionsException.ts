export class PermissionsException extends Error {
  constructor() {
    super('Permissions denied');
  }
}
