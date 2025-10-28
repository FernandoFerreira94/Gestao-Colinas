// Tipos de Dados Básicos
import type { Session } from "@supabase/supabase-js";

export interface SignInMutationReturn {
  auth: string;
  user: UsuarioProps | null;
  session: Session | null;
}

export interface UsuarioProps {
  user_id?: string;
  token?: string;
  nome_completo: string;
  cpf: string;
  matricula: string;
  is_adm: boolean;
  permissao_energia: boolean;
  permissao_agua: boolean;
  permissao_gas: boolean;
  funcao: string;
  created_at?: string;
}

export interface LoginProps {
  matricula: string;
  password: string;
}

export interface UserProps {
  token: string;
  user: UsuarioProps;
}

export interface InputDateProps {
  month: number;
  setMonth: (month: number) => void;
  year: number;
  setYear: (year: number) => void;
}

// Tipos Relacionados a Lojas e Medidores
export interface LojaUpdtadeProps {
  id?: string;
  nome_loja: string;
  numero_loja: string;
  prefixo_loja: string;
  complexo: string;
  ativa: boolean;
  tem_energia: boolean;
  tem_agua: boolean;
  tem_gas: boolean;
}
export interface LojaProps {
  id?: string;
  nome_loja: string;
  numero_loja: string;
  prefixo_loja: string;
  complexo: string;
  ativa: boolean;
  tem_energia: boolean;
  tem_agua: boolean;
  tem_gas: boolean;
  medidor?: MedidorComLeitura[];
  medidores?: MedidorComLeitura[];
}

export interface LojaComLeiturasCombinadas {
  id?: string;
  nome_loja: string;
  medidor: MedidorComLeitura[];
  leituras: LeituraProps[];
}

export interface MedidorProps extends Medidores {
  loja_id?: string;
}

export interface CreateLojaData {
  loja: LojaProps;
  medidores: Medidores[];
}

export interface LeituraProps {
  leitura_atual: number;
  consumo_mensal?: number;
  mes?: number;
  ano?: number;
  leitura_anterior?: number;
  created_at?: string;
  consumo_anterior?: number;
  foto_url: File | string | null;
  detalhes_leitura?: string | null;
  nome_loja_leitura: string;
  medidor_id: string;
  nome_usuario: string;
  medidor?: string;
  data_leitura?: string;
}

export interface Medidores {
  loja_id?: string;
  id?: string;
  tipo_medicao: string;
  localidade: string;
  numero_relogio: string;
  ultima_leitura?: number;
  detalhes: string;
  quadro_distribuicao?: string | null;
  data_instalacao?: string;
}
export interface MedidorComLeitura {
  id?: string;
  tipo_medicao: string;
  localidade: string;
  numero_relogio: string;
  ultima_leitura: number;
  detalhes: string;
  data_instalacao: string;
  leituras: LeituraProps[];
}

export interface DetalhesProps {
  params: Promise<{
    id: string;
    medidorId: string;
  }>;
}

export interface ChartDataItem {
  consumo: number;
  detalhes: string;
  month: string;
  nome_loja: string;
}

export interface TooltipPayload {
  active?: boolean;
  label?: string;
  payload?: {
    payload: ChartDataItem;
    value: number;
  }[];
}

export interface EditLeitura {
  leitura_atual?: number | null;
  detalhes_leitura?: string | null;
  foto_url?: File | string | null;
  nome_loja_leitura: string;
  medidor_id: string;
}

export interface EditMedidor {
  localidade: string;
  numero_relogio: string;
  quadro_distribuicao?: string | null;
  ultima_leitura?: number;
}

export interface EditLoja {
  nome_loja: string;
  numero_loja: string;
  prefixo_loja: string;
}

export interface MedidorPayload {
  id?: string; // Opcional para insert, necessário para update/delete
  loja_id: string; // Sempre necessário para upsert
  detalhes: string;
  numero_relogio: string;
  localidade: string;
  quadro_distribuicao?: string | null; // Opcional
  tipo_medicao: string; // Tipo string literal para segurança
  ultima_leitura: number;
}

export interface CustoProps {
  valor_custo: number;
  mes_custo?: number;
  ano_custo?: number;
  tipo_custo?: string;
}

export interface FetchCusto {
  mes_custo: number;
  ano_custo: number;
  tipo_custo: string;
}

export interface ErroProps {
  message: string;
}

export interface CreateLojaResponse {
  lojaData: LojaProps[];
  medidorData: MedidorComLeitura[] | null;
}

export interface SignInMutationReturn {
  auth: string;
  user: UsuarioProps | null;
  session: Session | null;
}
