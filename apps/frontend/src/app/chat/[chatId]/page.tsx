"use client";

import { useParams } from "next/navigation";
import Chat from "../chat";

const Page = () => {
  const { chatId } = useParams<{chatId: string}>()
  
  return <Chat chatId={chatId} />
};

export default Page;
