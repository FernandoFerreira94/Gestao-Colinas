import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface PrefixoLojaProps {
  edit: boolean;
  prefixo: string;
  setPrefixo: React.Dispatch<string>;
}

export function PrefixoLoja({ edit, prefixo, setPrefixo }: PrefixoLojaProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Prefixo loja</Label>
      <Select
        required
        value={prefixo}
        onValueChange={setPrefixo}
        disabled={edit}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um prefixo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NS">NS - (Nivel Superior)</SelectItem>
          <SelectItem value="NT">NT - (Nivel Terreo)</SelectItem>
          <SelectItem value="QS">QS - (Quisque Superior)</SelectItem>
          <SelectItem value="QT">QT - (Quisque Terreo)</SelectItem>
          <SelectItem value="QBT">QBT - (Quisque Boulevard Terreo)</SelectItem>
          <SelectItem value="QVB">
            QVB - (Quisque Vitrine Boulevard )
          </SelectItem>
          <SelectItem value="AE">AE - (Area externa)</SelectItem>
          <SelectItem value="AT">AT - (Area Tecnica)</SelectItem>
          <SelectItem value="CE">CE </SelectItem>
          <SelectItem value="D">D - (Deposito)</SelectItem>
          <SelectItem value="EST">EST - (Estacionamento)</SelectItem>
          <SelectItem value="TR">TR - (Torre Comercial)</SelectItem>
          <SelectItem value="CAG">CAG ( Central Agua Gelada )</SelectItem>
          <SelectItem value=" ">outros</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
