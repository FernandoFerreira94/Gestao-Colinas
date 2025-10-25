// apps/web/src/componente/content/index.tsx

"use client";
import { MdOutlineToggleOff, MdToggleOn } from "react-icons/md";
import { useAppContext } from "../../context/useAppContext";
import { SideBar } from "../sideBar";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "@/components/ui/modeToggle";
import { roxoPrimary } from "@/color";
import { useFetchUser } from "@/hook/Fetch/useFetchUser";
import { Title } from "../title";
import React from "react";
import { InputDate } from "@/components/ui/inputDate";

export function Content({
  children,
  title,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
}) {
  const { showSideBar, setShowSideBar } = useAppContext();
  const { data } = useFetchUser();

  const user = data?.user;
  const firstName = user?.nome_completo.split(" ")[0];

  return (
    <main className="h-full w-full text-gray-900 dark:text-gray-50   max-sm:w-full relative">
      <SideBar />
      <div
        className={`h-full transition-all mr-4 duration-800   ${
          showSideBar ? "ml-62" : "ml-20"
        } max-sm:m-0 `}
      >
        <div className="flex w-full mt-4 items-center  max-sm:hidden">
          <button
            className="h-full cursor-pointer max-sm:hidden "
            onClick={() => setShowSideBar(!showSideBar)}
          >
            {showSideBar ? (
              <MdToggleOn
                size={35}
                className={` text-[${roxoPrimary}] dark:text-gray-50 `}
              />
            ) : (
              <MdOutlineToggleOff
                size={35}
                className={` text-[${roxoPrimary}] dark:text-gray-50 `}
              />
            )}
          </button>
          <div className="flex h-full  justify-between items-center w-6/12 max-sm:w-full max-sm:flex-col-reverse max-sm:gap-4 ">
            <h1 className="ml-4 text-2xl  font-semibold flex items-center max-sm:hidden">
              {!user ? (
                <div className="space-y-2 flex items-center">
                  <Skeleton className="h-8 w-[300px]" />
                </div>
              ) : (
                ` ${firstName} - ${user.funcao}`
              )}
            </h1>
            <h1
              className={`ml-4 text-4xl font-bold text-[${roxoPrimary}] dark:text-gray-50 max-sm:hidden`}
            >
              Shopping Colinas
            </h1>
          </div>
          <div className="float-right ml-auto mr-8 max-sm:hidden">
            <ModeToggle />
          </div>
        </div>
        <div className={` h-full pl-13  border-t border-gray-300  mb-20 max-sm:mb-4 max-sm:pl-2 max-sm:w-full max-sm:border-none max-sm:mt-19`}>
          <section className="w-full flex mt-4 max-sm:items-center max-sm:px-2">
            <Title text={title} />
            <InputDate  />
          </section>
          {children}
        </div>
      </div>
    </main>
  );
}
