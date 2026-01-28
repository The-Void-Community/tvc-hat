export const ROUTE = "auth" as const;

export const ROUTES = {
  GET: "/:method",
  GET_CALLBACK: "/:method/callback",
  SIGN_UP: "/signup",
  SIGN_IN: "/signin",
} as const;
