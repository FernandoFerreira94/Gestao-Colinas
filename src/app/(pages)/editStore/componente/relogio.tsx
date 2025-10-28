import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Localidade } from "@/_componente/dateTipoMedicao/localidade";
import { Medidores } from "@/types"; // importa a interface completa

interface RelogioProps {
  medidor: Medidores;
  onChange: React.Dispatch<React.SetStateAction<Medidores>>;
  setLocalidade: (value: string) => void;
  quadro?: boolean;
}

export function Relogio({
  medidor,
  onChange,
  setLocalidade,
  quadro = false,
}: RelogioProps) {
  return (
    <div className="flex flex-col gap-4">
      <Label>Numero relogio</Label>
      <Input
        type="text"
        placeholder="Numero do relogio"
        required
        value={medidor.numero_relogio || ""}
        onChange={(e) =>
          onChange({ ...medidor, numero_relogio: e.target.value.toUpperCase() })
        }
        className="uppercase"
      />

      <Label>Localizaçao relogio</Label>
      <Localidade value={medidor.localidade || ""} setValue={setLocalidade} />

      {quadro && (
        <>
          <Label>Quadro de distribuiçao</Label>
          <Input
            type="text"
            placeholder="Digite o quadro de distribuição"
            value={medidor.quadro_distribuicao || ""}
            onChange={(e) =>
              onChange({ ...medidor, quadro_distribuicao: e.target.value })
            }
          />
        </>
      )}

      <Label>Ultima leitura</Label>
      <Input
        type="text"
        placeholder="Digite a ultima leitura"
        required
        value={String(medidor.ultima_leitura || "")}
        onChange={(e) =>
          onChange({ ...medidor, ultima_leitura: Number(e.target.value) })
        }
      />

      <Label htmlFor="detalhe_energia">Detalhes</Label>
      <Textarea
        placeholder="Adicione algum detalhe necessário"
        value={medidor.detalhes || ""}
        onChange={(e) => onChange({ ...medidor, detalhes: e.target.value })}
      />
    </div>
  );
}
