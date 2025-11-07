import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { useAppContext } from "@/context/useAppContext";
import { useEffect } from "react";

export function TipoMedica() {
  const { typeMedicao, setTypeMedicao, user } = useAppContext();
  useEffect(() => {
    function getTipoMedicaoLocalStorage() {
      const tipoMedicao = localStorage.getItem("typeMedicao") as
        | "Energia"
        | "Agua"
        | "Gas";

      if (tipoMedicao) {
        setTypeMedicao(tipoMedicao);
      }
    }

    getTipoMedicaoLocalStorage();
  }, [user, setTypeMedicao]);

  const renderizarOpcoesDeMedicao = () => {
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

  function SetMedicaoLocalStorage(value: "Energia" | "Agua" | "Gas") {
    setTypeMedicao(value);
    localStorage.setItem("typeMedicao", value);
  }

  return (
    <Select required value={typeMedicao} onValueChange={SetMedicaoLocalStorage}>
      <SelectTrigger>
        <SelectValue placeholder={"Selecione o tipo de medição"} />
      </SelectTrigger>
      <SelectContent className="flex">
        {user ? renderizarOpcoesDeMedicao() : <div>Carregando usuário...</div>}
      </SelectContent>
    </Select>
  );
}
