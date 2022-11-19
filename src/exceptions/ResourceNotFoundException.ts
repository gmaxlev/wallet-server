export class ResourceNotFoundException extends Error {
  constructor() {
    super('Resource is not found');
  }
}
