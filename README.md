# 🏢 GESTÃO COLINAS

**GESTÃO COLINAS** é um sistema web administrativo desenvolvido para auxiliar a gestão de medições de consumo de **energia, água e gás** em um complexo comercial que inclui um shopping e uma torre corporativa.

O projeto foi construído utilizando tecnologias modernas de frontend e backend, priorizando escalabilidade, desempenho e segurança. A aplicação web é o núcleo administrativo do sistema, responsável por cadastro, controle e análise dos dados coletados pelos dispositivos móveis.

---

## 🚀 Tecnologias Principais

- **Next.js** — Framework React para renderização otimizada e rotas avançadas.  
- **React.js** — Interface dinâmica e responsiva.  
- **Tailwind CSS** — Estilização moderna e produtiva.  
- **shadcn/ui** — Componentes acessíveis e altamente customizáveis.  
- **React Query** — Gerenciamento de dados assíncronos (queries e mutations).  
- **Sonner** — Sistema de notificações elegante e responsivo.  
- **Zod** — Validação de formulários e esquemas tipados.  
- **TypeScript** — Tipagem estática para segurança e escalabilidade.  
- **Supabase** — Backend completo (banco de dados, autenticação e storage).  

---

## ⚙️ Funcionalidades Principais

- 🔐 **Autenticação e cadastro de usuários** com Supabase.  
- 🧩 **Sistema de permissões administrativas (`is_admin`)**, controlando acesso e edição.  
- 🧭 **Rotas privadas e protegidas** com controle de sessão.  
- 🏬 **Cadastro e edição de lojas**, com associação a tipos de medição (energia, água e gás).  
- 📆 **Filtros inteligentes** por data, mês, ano, tipo de medição e localidade.  
- 🖼️ **Envio, upload e download de imagens** diretamente para o Supabase Storage.  
- 📊 **Relatórios e gráficos interativos** exibindo o consumo por loja e por relógio.  
- ⚖️ **Validação de medições** garantindo que os valores sejam sempre maiores que o mês anterior.  

---

## 🔗 Integração com Aplicativo Mobile

O sistema web se integra diretamente ao aplicativo **MEDIÇÃO COLINAS**, que é responsável pela coleta das medições em campo.  
As medições coletadas via mobile são sincronizadas em tempo real com o Supabase, alimentando os relatórios e gráficos disponíveis na interface administrativa.

---

## 🧱 Arquitetura e Organização

A aplicação é composta por camadas bem definidas:
- **Frontend (Next.js)**: interface administrativa e lógica de exibição.
- **Backend (Supabase)**: autenticação, banco de dados PostgreSQL e armazenamento de arquivos.
- **Validação (Zod)**: esquemas tipados e seguros.
- **Gerenciamento de estado (React Query)**: sincronia entre cliente e servidor.

---

## 🧩 Objetivo

O **GESTÃO COLINAS** foi projetado para otimizar a coleta, validação e visualização dos dados de consumo, oferecendo uma visão analítica do uso de recursos e facilitando a administração das unidades comerciais do complexo Colinas.

---

## 📱 Projeto Relacionado

🔗 [MEDIÇÃO COLINAS (Mobile)](https://github.com/FernandoFerreira94/Medicao-Colinas-Mobile)  
Aplicativo React Native responsável pela coleta de medições de energia, água e gás em campo.
