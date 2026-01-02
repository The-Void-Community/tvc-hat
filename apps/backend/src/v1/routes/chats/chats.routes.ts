const ROUTE = "chats";

const ROUTES = {
  GET_ONE: "/:slug",

  POST: "/",

  PUT: "/:slug",
  PATCH: "/:slug",

  PATCH_RIGHTS: "/:slug/rights",
  PATCH_JOIN: "/:slug/join",

  DELETE: "/:slug",
} as const;

export { ROUTE, ROUTES };
