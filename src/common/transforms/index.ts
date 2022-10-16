import { Transform } from 'class-transformer';

export function Trim() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }
    return value.trim();
  });
}
