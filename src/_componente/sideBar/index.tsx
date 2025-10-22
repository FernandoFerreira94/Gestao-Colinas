// apps/web/src/_componente/sideBar.tsx

"use client";
import Image from "next/image";
import {
  TbUserEdit,
  TbHomeEdit,
  TbHomePlus,
  TbTable,
  TbTableFilled,
  TbUserCircle,
  TbFileExcel,
  TbLogout2,
  TbUserPlus,
  TbHomeFilled,
  TbUserFilled,
  TbFileXFilled,
} from "react-icons/tb";
import { FaCircleUser, FaRegCircleUser } from "react-icons/fa6";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Cookies from "js-cookie";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useAppContext } from "../../context/useAppContext";

import LogoI from "../../assets/IconsIwhite.png";
import Logo from "../../assets/LogoWhite.png";

import { roxoPrimary, roxoDark } from "@/color";
import { useFetchUser } from "@/hook/Fetch/useFetchUser";
import { useFetchAllUsers } from "@/hook/Fetch/useFetchAllUsers";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SideBar({
  isMobile = false,
  onClose,
}: {
  isMobile?: boolean;
  onClose?: () => void;
}) {
  const { showSideBar, setUser } = useAppContext();
  const router = useRouter();
  const pathName = usePathname();
  const { setTheme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  function handleLogout() {
    setUser(null);
    Cookies.remove("auth_token");
    router.push("/");
    setTheme("light");
    if (onClose) onClose();
  }

  const { data } = useFetchUser();
  const { data: userAll } = useFetchAllUsers();
  const user = data?.user;

  const baseNavClass = `fixed top-0 left-0 h-screen bg-[${roxoPrimary}] dark:bg-[${roxoDark}] rounded-tr-[16px] rounded-br-[16px] shadow-md transition-all duration-300 z-30 flex flex-col`;
  const desktopWidthClass = showSideBar ? "w-55" : "w-16 items-center";
  const mobileClass = `w-full bg-[${roxoPrimary}] dark:bg-[${roxoDark}]`;

  return (
    <nav
      className={`${baseNavClass} ${isMobile ? mobileClass : desktopWidthClass}
      ${isMobile ? "" : "max-sm:hidden"} `}
    >
      {isMobile && (
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-bold text-gray-50">Menu</h2>
          <button onClick={onClose} className="text-gray-50">
            <TbLogout2 size={24} />{" "}
          </button>
        </div>
      )}

      <div className="mt-4 max-sm:hidden w-full flex justify-center">
        {showSideBar ? (
          <Image
            src={Logo}
            alt="Logo"
            width={130}
            height={130}
            className="mt-6"
          />
        ) : (
          <Image
            src={LogoI}
            alt="Logo"
            width={40}
            height={40}
            className="mt-6"
          />
        )}
      </div>

      <ul
        className={`flex flex-col h-full w-full py-3 text-gray-100 ${
          isMobile ? "text-sm" : "text-[17px]"
        }`}
      >
        <li
          title="Painel"
          className={`flex items-center cursor-pointer hover:bg-white/10 ${
            pathName === "/medicao" && "bg-white/20"
          } ${
            isMobile
              ? "py-2 px-4"
              : showSideBar
              ? "py-2 px-3"
              : "py-2 px-0 justify-center"
          }`}
          onClick={onClose}
        >
          <Link
            href="/medicao"
            className={`w-full h-full flex items-center gap-2 ${
              showSideBar || isMobile ? "justify-start" : "justify-center"
            }`}
          >
            {" "}
            {pathName === "/medicao" ? (
              <TbTableFilled size={isMobile ? 20 : 22} />
            ) : (
              <TbTable size={isMobile ? 20 : 22} />
            )}
            {(showSideBar || isMobile) && <span>Dashboard</span>}
          </Link>
        </li>

        {user?.is_adm && (
          <>
            <li
              title="Cadastrar loja"
              className={`flex items-center cursor-pointer hover:bg-white/10 ${
                pathName === "/registerStore" && "bg-white/20"
              } ${
                isMobile
                  ? "py-2 px-4"
                  : showSideBar
                  ? "py-2 px-3"
                  : "py-2 px-0 justify-center"
              }`}
              onClick={onClose}
            >
              <Link
                href="/registerStore"
                className={`w-full h-full flex items-center gap-2 ${
                  showSideBar || isMobile ? "justify-start" : "justify-center"
                }`}
              >
                {pathName === "/registerStore" ? (
                  <TbHomeFilled size={isMobile ? 20 : 26} />
                ) : (
                  <TbHomePlus size={isMobile ? 20 : 26} />
                )}
                {(showSideBar || isMobile) && <span>Registrar loja</span>}
              </Link>
            </li>

            <li
              title="Editar loja"
              className={`flex items-center cursor-pointer hover:bg-white/10 ${
                pathName === "/editStore" && "bg-white/20"
              } ${
                isMobile
                  ? "py-2 px-4"
                  : showSideBar
                  ? "py-2 px-3"
                  : "py-2 px-0 justify-center"
              }`}
              onClick={onClose}
            >
              <Link
                href="/editStore"
                className={`w-full h-full flex items-center gap-2 ${
                  showSideBar || isMobile ? "justify-start" : "justify-center"
                }`}
              >
                {pathName === "/editStore" ? (
                  <TbHomeFilled size={isMobile ? 20 : 26} />
                ) : (
                  <TbHomeEdit size={isMobile ? 20 : 26} />
                )}
                {(showSideBar || isMobile) && <span>Editar loja</span>}
              </Link>
            </li>

            <li
              title="Cadastrar usuário"
              className={`flex items-center cursor-pointer hover:bg-white/10 ${
                pathName === "/registerUser" && "bg-white/20"
              } ${
                isMobile
                  ? "py-2 px-4"
                  : showSideBar
                  ? "py-2 px-3"
                  : "py-2 px-0 justify-center"
              }`}
              onClick={onClose}
            >
              <Link
                href="/registerUser"
                className={`w-full h-full flex items-center gap-2 ${
                  showSideBar || isMobile ? "justify-start" : "justify-center"
                }`}
              >
                {pathName === "/registerUser" ? (
                  <TbUserFilled size={isMobile ? 20 : 26} />
                ) : (
                  <TbUserPlus size={isMobile ? 20 : 26} />
                )}
                {(showSideBar || isMobile) && <span>Registrar usuário</span>}
              </Link>
            </li>

            <li
              title="Editar usuário"
              className={`flex items-center cursor-pointer hover:bg-white/10 ${
                isSheetOpen && "bg-white/20"
              } ${
                isMobile
                  ? "py-2 px-4"
                  : showSideBar
                  ? "py-2 px-3"
                  : "py-2 px-0 justify-center"
              }`}
            >
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <button
                    className={`w-full h-full flex items-center gap-2 ${
                      showSideBar || isMobile
                        ? "justify-start"
                        : "justify-center"
                    }`}
                  >
                    <TbUserEdit size={isMobile ? 20 : 26} />
                    {(showSideBar || isMobile) && <span>Editar usuário</span>}
                  </button>
                </SheetTrigger>
                <SheetContent
                  side={"left"}
                  className="bg-[#3D3C6C] dark:bg-[#151526]"
                >
                  <SheetHeader>
                    <SheetTitle>Selecione o usuário</SheetTitle>
                    <SheetDescription className="w-full text-gray-100 dar flex justify-between px-4 my-2">
                      <span>Nome</span>Função
                    </SheetDescription>
                    <div className="w-full flex flex-col gap-4 pt-4">
                      {userAll?.map((user) => (
                        <Button
                          key={user.user_id}
                          variant={"outline"}
                          className="w-full"
                          onClick={onClose}
                        >
                          <Link
                            href={`/editUser/${user.user_id}`}
                            className="w-full h-full flex justify-between items-center rounded-xl px-4 hover:bg-gray-200 dark:hover:bg-[#2B2B41]"
                          >
                            <span title={user.nome_completo}>
                              {user.nome_completo.length > 15
                                ? user.nome_completo.slice(0, 20) + "..."
                                : user.nome_completo}
                            </span>
                            <span title={user.funcao}>{user.funcao}</span>
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </li>

            <li
              title="Exportar Excel"
              className={`flex items-center cursor-pointer hover:bg-white/10 ${
                pathName === "/exportExcel" && "bg-white/20"
              } ${
                isMobile
                  ? "py-2 px-4"
                  : showSideBar
                  ? "py-2 px-3"
                  : "py-2 px-0 justify-center"
              }`}
              onClick={onClose}
            >
              <Link
                href="/exportExcel"
                className={`w-full h-full flex items-center gap-2 ${
                  showSideBar || isMobile ? "justify-start" : "justify-center"
                }`}
              >
                {pathName === "/exportExcel" ? (
                  <TbFileXFilled size={isMobile ? 20 : 26} />
                ) : (
                  <TbFileExcel size={isMobile ? 20 : 26} />
                )}
                {(showSideBar || isMobile) && <span>Relatorio</span>}
              </Link>
            </li>
          </>
        )}

        {!isMobile && (
          <li
            title="Perfil"
            className={`flex items-center cursor-pointer hover:bg-white/10 ${
              pathName === "/profile" && "bg-white/20"
            } ${showSideBar ? "py-2 px-3" : "py-2 px-0 justify-center"}`}
          >
            <Link
              href="/profile"
              className={`w-full h-full flex items-center gap-2 ${
                showSideBar ? "justify-start" : "justify-center"
              }`}
            >
              {pathName === "/profile" ? (
                <FaCircleUser size={isMobile ? 20 : 24} />
              ) : (
                <FaRegCircleUser size={isMobile ? 20 : 24} />
              )}
              {showSideBar && <span>Perfil</span>}
            </Link>
          </li>
        )}

        <li
          title="Sair"
          className={`mt-auto mb-4 flex justify-center 
                      ${
                        isMobile
                          ? "py-2 px-4"
                          : showSideBar
                          ? "py-2 px-3"
                          : "py-2 px-0 justify-center"
                      }
                      bg-red-500/30 hover:bg-red-500/50 dark:bg-red-600/30 dark:hover:bg-red-600/50 rounded-md mx-2`}
        >
          <button
            onClick={handleLogout}
            className="h-full flex items-center gap-2 w-full justify-center cursor-pointer text-gray-100"
          >
            <TbLogout2 size={isMobile ? 20 : 26} />
            {(showSideBar || isMobile) && <span>Sair</span>}
          </button>
        </li>
      </ul>
    </nav>
  );
}
