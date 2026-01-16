const ROUTE = "chats";

const ROUTES = {
  GET_MANY: "/",
  GET_ONE: "/:slug",
  GET_BY_USER: "/u/:userSlug",
  
  POST_DIRECT_CHAT: "/u/:userSlug",
  POST: "/",

  PUT: "/:slug",
  PATCH: "/:slug",

  PATCH_RIGHTS: "/:slug/rights",
  PATCH_JOIN: "/:slug/join",

  DELETE: "/:slug",
} as const;

export { ROUTE, ROUTES };
