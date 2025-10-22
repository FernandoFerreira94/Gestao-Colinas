import { useAppContext } from "@/context/useAppContext";

export function Li({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  const { showSideBar } = useAppContext();
  return (
    <li
      title={title}
      className={`text-gray-100 flex gap-2 items-center text-basic  h-12 hover:bg-[#2d2d50] dark:hover:bg-[#2B2B41]  w-full justify-center  cursor-pointer text-basic ${
        showSideBar ? "justify-start pl-4" : "justify-center"
      } ${className}`}
    >
      {children}
    </li>
  );
}
