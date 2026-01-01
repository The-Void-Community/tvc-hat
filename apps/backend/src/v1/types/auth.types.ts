export const AUTH_TYPES = ["google"] as const;
export type AuthTypes = (typeof AUTH_TYPES)[number];
