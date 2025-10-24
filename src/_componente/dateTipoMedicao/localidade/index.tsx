import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definindo os tipos das props para maior clareza e segurança
interface LocalidadeProps {
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
}

export function Localidade({
  value,
  setValue,
  disabled = false,
}: LocalidadeProps) {
  return (
    <Select onValueChange={setValue} value={value} disabled={disabled}>
      <SelectTrigger className="bg-white dark:bg-[#151526]">
        <SelectValue placeholder={"Selecione a localização"} />
      </SelectTrigger>
      <SelectContent className="flex">
        <div className="scroll flex-1 overflow-y-auto max-h-[calc(100vh-20rem)] pb-10">
          <SelectItem value="all" className="flex items-center gap-2">
            Todos
          </SelectItem>
          <SelectItem value="Sub-Adm" className="flex items-center gap-2">
            Sub-Adm
          </SelectItem>
          <SelectItem value="CM-1" className="flex items-center gap-2">
            CM-1
          </SelectItem>
          <SelectItem value="CM-2" className="flex items-center gap-2">
            CM-2
          </SelectItem>
          <SelectItem value="Shaft-NT" className="flex items-center gap-2">
            Shaft - NT
          </SelectItem>
          <SelectItem value="Shaft-NS" className="flex items-center gap-2">
            Shaft - NS
          </SelectItem>
          <SelectItem
            value="Area tecnica 26"
            className="flex items-center gap-2"
          >
            Area tecnica 26
          </SelectItem>
          <SelectItem
            value="Area tecnica 27"
            className="flex items-center gap-2"
          >
            Area tecnica 27
          </SelectItem>
          <SelectItem value="Sub-Band" className="flex items-center gap-2">
            Sub-Band
          </SelectItem>
          <SelectItem value="CAG" className="flex items-center gap-2">
            CAG
          </SelectItem>
          <SelectItem
            value="Sub-Doca-Hotel"
            className="flex items-center gap-2"
          >
            Sub-Doca-Hotel
          </SelectItem>
          <SelectItem value="Sub-Eco-Primo" className="flex items-center gap-2">
            Sub-Eco-Primo
          </SelectItem>
          <SelectItem value="Sub-Principal" className="flex items-center gap-2">
            Sub-Principal
          </SelectItem>
          <SelectItem value="Hotel" className="flex items-center gap-2">
            Hotel
          </SelectItem>
          <SelectItem value="Casa-Bomba" className="flex items-center gap-2">
            Casa-Bomba
          </SelectItem>

          <SelectItem
            value="Torre-Comercial"
            className="flex items-center gap-2"
          >
            Torre-Comercial
          </SelectItem>

          <SelectItem value="Loja" className="flex items-center gap-2">
            Loja
          </SelectItem>
          <SelectItem value="BUSWAY" className="flex items-center gap-2">
            BUSWAY
          </SelectItem>
          <SelectItem value="Outros" className="flex items-center gap-2">
            Outros
          </SelectItem>
        </div>
      </SelectContent>
    </Select>
  );
}
