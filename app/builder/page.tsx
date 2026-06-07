"use client";

import dynamic from "next/dynamic";

const BuilderClient = dynamic(() => import("./builder-client"), { ssr: false });

export default function BuilderPage() {
  return <BuilderClient />;
}