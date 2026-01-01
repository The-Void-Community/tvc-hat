const ROUTE = "test";

const ROUTES = {
  GET: "/",
  GET_PUBLIC: "/public",
  GET_TOO_MANY_REQUESTS_NON_PROTECTED: "/too-many-requests",
} as const;

export { ROUTE, ROUTES };
