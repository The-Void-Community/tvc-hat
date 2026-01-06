const ROUTE = "messages";

const ROUTES = {
  GET: "/",
  GET_ONE: "/:id",

  PUT: "/:id",
  PATCH: "/:id",

  DELETE: "/:id",
} as const;

export { ROUTE, ROUTES };
