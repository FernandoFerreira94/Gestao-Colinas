"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LogoWhite from "@/assets/LogoWhite.png";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Espera 2s -> inicia fade-out
    const timer = setTimeout(() => {
      setFadeOut(true);

      // Espera mais 0.5s -> remove splash do DOM
      setTimeout(() => setIsVisible(false), 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-[#3D3C6C] transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      } z-50`}
    >
      <Image
        src={LogoWhite}
        alt="Logo"
        width={400}
        height={400}
        className="max-sm:w-7/12"
      />
    </div>
  );
}
