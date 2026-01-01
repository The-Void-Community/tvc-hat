const ROUTE = ["users", "u"];

const ROUTES = {
  GET_ONE: "/:slug",

  PUT: "/:slug",
  PATCH: "/:slug",

  DELETE: "/:slug",
} as const;

export { ROUTE, ROUTES };
