"use client";
import { useMemo } from "react";

const DynamicText = ({ text }: { text: string }) => {
  const fontSize = useMemo(() => {
    const textLength = text.length;


    const newSize = Math.max(24, 36 - textLength);
    return `${newSize}px`;
  }, [text]);

  return (
    <h1
      className="font-bold  text-text-primary text-center "
      style={{ fontSize }}
    >
      {text || "Unknown Player"}
    </h1>
  );
};

export default DynamicText;
