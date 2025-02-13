"use client";
import Navbar from "@/components/nav-bar";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Navbar />

    </>
  );
}
