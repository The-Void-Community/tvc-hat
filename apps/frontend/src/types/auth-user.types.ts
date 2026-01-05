export type AuthUser = {
  id: string;
  serviceId: string;
  profileId: string;
  accessToken: string;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
};
