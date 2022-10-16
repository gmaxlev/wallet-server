import { SetMetadata } from '@nestjs/common';

export const rolesMetadataKey = Symbol('RoleMetadataKey');

export const onlyUnauthorizedKey = Symbol('onlyUnauthorized');

export enum UserRole {
  USER,
  ADMIN,
}

export function SetRoles(...roles) {
  return SetMetadata(rolesMetadataKey, roles);
}

export function OnlyUnauthorized() {
  return SetMetadata(onlyUnauthorizedKey, true);
}
