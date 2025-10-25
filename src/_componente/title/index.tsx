import React from "react";

export function Title({ text }: { text: React.ReactNode }) {
  return <h1 className="text-2xl font-medium max-sm:text-xl">{text}</h1>;
}
