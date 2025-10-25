import { useState, useEffect } from "react";

export function useWindowWidth() {
  const [width, setWidth] = useState<number >(0);

  useEffect(() => {
    // Garante que só roda no client
    function handleResize() {
      setWidth(window.innerWidth);
    }

    handleResize(); // já define o valor inicial
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}
