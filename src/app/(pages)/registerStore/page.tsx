"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";

import { Content } from "@/_componente/content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import { Localidade } from "@/_componente/dateTipoMedicao/localidade";
import { useCreateLoja } from "@/hook/Create/useCreateLoja";
import { capitalizeWords } from "@/variavel/capitalizeWords";
import { ButtonLoading } from "@/components/ui/buttonLoading";

export default function RegisterStore() {
  const formRef = useRef<HTMLFormElement>(null);

  const [complexo, setComplexo] = useState("Shopping Colinas");
  const [ativa, setAtiva] = useState(true);
  const [energia, setEnergia] = useState(false);
  const [agua, setAgua] = useState(false);
  const [gas, setGas] = useState(false);
  const [prefixo, setPrefixo] = useState("NT");

  const [localidade_energia, setLocalidade_energia] = useState("");
  const [localidade_agua, setLocalidade_agua] = useState("");
  const [localidade_gas, setLocalidade_gas] = useState("");

  // Função para resetar todos os estados
  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    setComplexo("Shopping Colinas");
    setAtiva(true);
    setEnergia(false);
    setAgua(false);
    setGas(false);
    setLocalidade_energia("");
    setLocalidade_agua("");
    setLocalidade_gas("");
  };

  const { mutate, isPending } = useCreateLoja({
    onSuccess: (data) => {
      toast(`Loja ${data.lojaData[0]?.nome_loja} cadastrada com sucesso!`);

      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleSumbit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nomeLoja = formData.get("nome_loja") as string;

    if (energia && !localidade_energia) {
      toast.error("Selecione uma localidade para energia!");
      return;
    }
    if (agua && !localidade_agua) {
      toast.error("Selecione uma localidade para agua!");
      return;
    }
    if (gas && !localidade_gas) {
      toast.error("Selecione uma localidade para gas!");
      return;
    }

    const loja = {
      complexo: complexo,
      nome_loja: capitalizeWords({ str: nomeLoja }),
      numero_loja: formData.get("numero_loja") as string,
      ativa: ativa,
      tem_energia: energia,
      tem_agua: agua,
      tem_gas: gas,
      prefixo_loja: prefixo,
      created_at: new Date("2025-08-01").toISOString(),
    };

    const medidores = [];

    if (energia) {
      medidores.push({
        tipo_medicao: "Energia",
        numero_relogio: formData.get("numero_relogio_energia") as string,
        localidade: localidade_energia,
        quadro_distribuicao: formData.get("quadro_distribuicao") as string,
        data_instalacao: new Date("2025-08-01").toISOString(),
        ultima_leitura: parseFloat(
          formData.get("ultima_leitura_energia") as string
        ),
        detalhes: formData.get("detalhe_energia") as string,
      });
    }
    if (agua) {
      medidores.push({
        tipo_medicao: "Agua",
        numero_relogio: formData.get("numero_relogio_agua") as string,
        localidade: localidade_agua,
        data_instalacao: new Date("2025-08-01").toISOString(),
        quadro_distribuicao: null,
        ultima_leitura: parseFloat(
          formData.get("ultima_leitura_agua") as string
        ),
        detalhes: formData.get("detalhe_agua") as string,
      });
    }

    if (gas) {
      medidores.push({
        tipo_medicao: "Gas",
        numero_relogio: formData.get("numero_relogio_gas") as string,
        localidade: localidade_gas,
        data_instalacao: new Date("2025-08-01").toISOString(),
        quadro_distribuicao: null,
        ultima_leitura: parseFloat(
          formData.get("ultima_leitura_gas") as string
        ),
        detalhes: formData.get("detalhe_gas") as string,
      });
    }
    console.log(loja);
    console.log(medidores);
    mutate({ loja, medidores });
  }

  return (
    <Content title="Cadastrar Loja">
      <section className="w-full flex">
        <form
          className="flex flex-col gap-4 mt-8 w-full"
          onSubmit={handleSumbit}
          ref={formRef} // Adicione a referência aqui
        >
          {/* ... todo o resto do seu formulário ... */}
          <div className="w-xl flex flex-col gap-4 max-2xl:w-8/12">
            <Label>Complexo</Label>
            <Select required value={complexo} onValueChange={setComplexo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Shopping Colinas">
                  Shopping Colinas
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Switch
                id="ativa"
                onCheckedChange={setAtiva}
                checked={ativa}
                name="ativa"
              />
              <Label htmlFor="ativa">Esta loja esta ativa?</Label>
            </div>

            <Label>Loja</Label>
            <Input
              type="text"
              placeholder="Nome da loja"
              id="nome_loja"
              required
              name="nome_loja"
              className="uppercase"
            />

            <Label>Nº loja</Label>
            <Select required value={prefixo} onValueChange={setPrefixo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NS">NS - (Nivel Superior)</SelectItem>
                <SelectItem value="NT">NT - (Nivel Terreo)</SelectItem>
                <SelectItem value="QS">QS - (Quisque Superior)</SelectItem>
                <SelectItem value="QT">QT - (Quisque Terreo)</SelectItem>
                <SelectItem value="QBT">
                  QBT - (Quisque Boulevard Terreo)
                </SelectItem>
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
            <Input
              type="text"
              placeholder="Numero da loja 01"
              id="numero_loja"
              required
              name="numero_loja"
            />
          </div>

          <div
            className={`w-full ${
              agua || gas ? "flex-row" : "flex-col"
            } flex gap-4 max-2xl:flex-col`}
          >
            <div className="flex flex-col gap-4 w-3/10 max-2xl:w-8/12">
              <div className="flex items-center space-x-2">
                <Switch
                  id="energia"
                  onCheckedChange={setEnergia}
                  checked={energia}
                  name="energia"
                />
                <Label htmlFor="energia">Energia</Label>
              </div>

              {energia && (
                <div className="flex flex-col gap-4">
                  <Label>Numero relogio</Label>
                  <Input
                    type="text"
                    placeholder="Numero do relogio"
                    required
                    id="numero_relogio_energia"
                    name="numero_relogio_energia"
                  />
                  <Label>Localizaçao relogio</Label>
                  <Localidade
                    value={localidade_energia}
                    setValue={setLocalidade_energia}
                  />
                  <Label>Quadro de distribuiçao</Label>
                  <Input
                    type="text"
                    placeholder="Digite o quadro de distribuição"
                    id="quadro_distribuicao"
                    name="quadro_distribuicao"
                  />
                  <Label>Ultima leitura</Label>
                  <Input
                    type="text"
                    placeholder="Digite a ultima leitura"
                    required
                    id="ultima_leitura_energia"
                    name="ultima_leitura_energia"
                    step="0.01"
                  />
                  <Label htmlFor="picture">Foto medidor</Label>
                  <Input id="picture" type="file" />
                  <Label htmlFor="detalhe_energia">Detalhes</Label>
                  <Textarea
                    placeholder="Adicione algun detalhes necessario"
                    id="detalhe_energia"
                    name="detalhe_energia"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 w-3/10 max-2xl:w-8/12">
              <div className="flex items-center space-x-2">
                <Switch
                  id="agua"
                  onCheckedChange={setAgua}
                  checked={agua}
                  name="agua"
                />
                <Label htmlFor="agua">Agua</Label>
              </div>
              {agua && (
                <div className="flex flex-col gap-4">
                  <Label>Numero relogio</Label>
                  <Input
                    type="text"
                    placeholder="Numero do relogio"
                    required
                    id="numero_relogio_agua"
                    name="numero_relogio_agua"
                  />
                  <Label>Localizaçao relogio</Label>
                  <Localidade
                    value={localidade_agua}
                    setValue={setLocalidade_agua}
                  />
                  <Label>Ultima leitura</Label>
                  <Input
                    type="text"
                    placeholder="Digite a ultima leitura"
                    required
                    id="ultima_leitura_agua"
                    name="ultima_leitura_agua"
                    step="0.01"
                  />
                  <Label htmlFor="picture">Foto medidor</Label>
                  <Input id="picture" type="file" />
                  <Label htmlFor="detalhe_agua">Detalhes</Label>
                  <Textarea
                    placeholder="Adicione algun detalhes necessario"
                    id="detalhe_agua"
                    name="detalhe_agua"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 w-3/10 max-2xl:w-8/12">
              <div className="flex items-center space-x-2">
                <Switch
                  id="gas"
                  onCheckedChange={setGas}
                  checked={gas}
                  name="gas"
                />
                <Label htmlFor="gas">Gás</Label>
              </div>
              {gas && (
                <div className="flex flex-col gap-4">
                  <Label>Numero relogio</Label>
                  <Input
                    type="text"
                    placeholder="Numero do relogio"
                    required
                    id="numero_relogio_gas"
                    name="numero_relogio_gas"
                  />
                  <Label>Localizaçao relogio</Label>
                  <Localidade
                    value={localidade_gas}
                    setValue={setLocalidade_gas}
                  />
                  <Label>Ultima leitura</Label>
                  <Input
                    type="text"
                    placeholder="Digite a ultima leitura"
                    required
                    id="ultima_leitura_gas"
                    name="ultima_leitura_gas"
                    step="0.01"
                  />
                  <Label htmlFor="picture">Foto medidor</Label>
                  <Input id="picture" type="file" />
                  <Label htmlFor="detalhe_gas">Detalhes</Label>
                  <Textarea
                    placeholder="Adicione algun detalhes necessario"
                    id="detalhe_gas"
                    name="detalhe_gas"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="w-xl max-2xl:w-8/12">
            {isPending ? (
              <ButtonLoading />
            ) : (
              <Button type="submit" className="w-full">
                Cadastrar loja
              </Button>
            )}
          </div>
        </form>
      </section>
    </Content>
  );
}
