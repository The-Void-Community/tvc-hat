const ROUTE = "chats";

const ROUTES = {
  GET_ONE: "/:slug",

  POST: "/",

  PUT: "/:slug",
  PATCH: "/:slug",

  PATCH_RIGHTS: "/:slug/rights",

  DELETE: "/:slug",
} as const;

export { ROUTE, ROUTES };
