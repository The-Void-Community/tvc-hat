'use client'

import { Button } from "@/ui/button.ui";

export default function Home() {
  return (
    <div className="min-h-full flex flex-col gap-4 justify-center content-center flex-wrap">
      <Button onClick={() => {
        window.location.href = "http://localhost:8080/api/v1/auth/google";
      }}>
        Authenticate by Google
      </Button>
    </div>
  );
}
