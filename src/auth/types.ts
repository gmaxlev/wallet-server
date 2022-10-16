import { UserRole } from '../user/roles';

export interface JwtTokenPayloadUser {
  id: number;
  roles: UserRole[];
}

export interface JwtTokenPayload extends JwtTokenPayloadUser {
  iat: number;
  exp: number;
}

export interface JwtRefreshPayloadUser {
  id: number;
  remember: boolean;
}

export interface JwtRefreshPayload extends JwtRefreshPayloadUser {
  iat: number;
  exp: number;
}

export interface UserRequest {
  id: number;
  roles: number[];
}

export interface IssuedTokens {
  token: {
    string: string;
    payload: JwtTokenPayload;
  };
  refresh: {
    string: string;
    payload: JwtRefreshPayload;
  };
}

declare global {
  namespace Express {
    export interface Request {
      user?: UserRequest | null;
    }
  }
}
