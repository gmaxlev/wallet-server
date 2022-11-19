import { UserFriendlyException } from '../../common/exceptions/UserFriendlyException';

export class LocalizeException extends UserFriendlyException {
  constructor(message: string | string[], code = 400) {
    super(message, code);
  }
}
