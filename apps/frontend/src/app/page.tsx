"use client";

import Home from "./home";
import { Suspense } from "react";

const Page = ({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) => {
  return (
    <Suspense fallback={<>...</>}>
      <Home query={searchParams} />
    </Suspense>
  );
};

export default Page;
