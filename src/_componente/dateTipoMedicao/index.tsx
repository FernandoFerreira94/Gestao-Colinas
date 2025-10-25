// src/components/DateTipoMedicao.tsx

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MdSearch } from "react-icons/md";
import { InputDate } from "@/components/ui/inputDate";
import { useAppContext } from "@/context/useAppContext";
import { useEffect } from "react"; // 👈 Importe useEffect
import { Localidade } from "./localidade";

export function DateTipoMedicao() {
  const {
    setTypeMedicao,
    typeMedicao,
    user,
    setSearchQuery,
    localidade,
    setLocalidade,
  } = useAppContext();

  useEffect(() => {
    if (user) {
      switch (user.funcao) {
        case "Bombeiro":
          setTypeMedicao("Gas");
          break;
        case "M5-Eletricista":
          setTypeMedicao("Energia");
          break;
        case "M4-Serviços Gerais":
          setTypeMedicao("Agua");
          break;
        default:
          setTypeMedicao("Energia"); // Valor padrão se a função não for uma das opções
          break;
      }
    } else {
      // Valor padrão enquanto o usuário não estiver logado
      setTypeMedicao("Energia");
    }
  }, [user, setTypeMedicao]);

  const renderizarOpcoesDeMedicao = () => {
    // ... (restante do seu código da função renderizarOpcoesDeMedicao)

    return (
      <>
        {user?.permissao_energia && (
          <SelectItem value="Energia" className="flex items-center gap-2">
            Energia
          </SelectItem>
        )}
        {user?.permissao_agua && (
          <SelectItem value="Agua" className="flex items-center gap-2">
            Água
          </SelectItem>
        )}
        {user?.permissao_gas && (
          <SelectItem value="Gas" className="flex items-center gap-2">
            Gás
          </SelectItem>
        )}
      </>
    );
  };

  return (
    <div className="w-full flex items-center justify-end gap-20 mr-8 mt-4  max-sm:flex-col-reverse max-sm:mr-2 max-sm:gap-4">
      <div className="w-200 h-full flex items-end relative mr-auto max-sm:w-full">
        <Input
          placeholder="Nome loja e numero medidor"
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-300  max-sm:text-sm"
          type="search"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <MdSearch size={20} className="absolute left-3 top-10 text-gray-500 max-sm:top-3" />
      </div>
      <div className="flex gap-4">

      <div className="w-40 h-full flex items-end text-gray-900 dark:text-gray-50 ">
        <Localidade value={localidade} setValue={setLocalidade} />
      </div>
      <div className="w-40 h-full flex items-end ">
        <Select required value={typeMedicao} onValueChange={setTypeMedicao}>
          <SelectTrigger>
            <SelectValue placeholder={"Selecione o tipo de medição"} />
          </SelectTrigger>
          <SelectContent className="flex">
            {renderizarOpcoesDeMedicao()}
          </SelectContent>
        </Select>
      </div>
      </div>
      <div className="max-sm:hidden">
        <InputDate />
      </div>
    </div>
  );
}
