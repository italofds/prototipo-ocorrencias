# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) para trabalhar com o código deste repositório.

## Idioma

- Conduza toda a conversa com o usuário neste repositório em português (pt-BR).
- Escreva o código sempre em inglês — nomes de arquivos, componentes, variáveis, funções, tipos, props etc. —
  seguindo os padrões já usados no projeto (ex: `Button.vue`, `uid()`, `FormState`, `HomeView.vue`). Caso identifique algum identificador em português que passou despercebido, não traduza automaticamente. Primeiro informe e pergunte se deseja traduzir.
- Textos voltados ao usuário final (labels, placeholders, mensagens de UI) continuam em português, pois é o
  padrão já adotado no projeto (é um sistema da PCDF).

## Convenções de trabalho

- Prefira sempre a solução mais simples possível. Evite o uso extensivo de bibliotecas externas quando o
  mesmo resultado puder ser alcançado de forma simples com o que já está disponível no projeto (Vue, Tailwind,
  as próprias dependências já usadas).
- Ao executar uma atividade solicitada, não é necessário rodar testes visuais (subir o servidor de
  desenvolvimento, usar Playwright etc.) depois de concluir, a menos que isso seja explicitamente pedido.
- Antes de rodar qualquer comando de linha de comando, explique exatamente o que cada trecho do comando faz e
  pergunte se pode executá-lo.

## Visão geral do projeto

Protótipo apenas de front-end (sem backend) de um sistema de registro de ocorrências policiais ("Ocorrências
Policiais") da Polícia Civil do Distrito Federal (PCDF). Todos os dados exibidos (números de protocolo,
participantes, homologação) são mockados dentro dos próprios componentes; não há persistência nem camada de
API. Os textos de UI e os campos de domínio estão em português (pt-BR) — mantenha os novos textos de UI
consistentes com isso.

## Comandos

- `npm run dev` — inicia o servidor de desenvolvimento do Vite
- `npm run build` — checa tipos com `vue-tsc --noEmit` e depois builda com o Vite
- `npm run preview` — visualiza o build de produção

Não há script de lint ou de testes configurado neste repositório.

## Arquitetura

**Wizard de página única, sem biblioteca de gerenciamento de estado.** `src/views/HomeView.vue` concentra todo
o estado do formulário em um único objeto `reactive<FormState>` (definido em `src/types/index.ts`) e renderiza
um dos cinco componentes de etapa por vez, com base em `activeIdx`, repassando fatias do estado via `v-model`
(`defineModel` do Vue):

- `StepBasics` (`basicos`) — tipo de ocorrência, classificação, local, natureza(s), unidades móveis, denúncias vinculadas
- `StepPeople` (`pessoas`) — pessoas envolvidas
- `StepObjects` (`objetos`) — objetos/veículos
- `StepHistory` (`historico`) — narrativa livre
- `StepAttachments` (`anexos`) — anexos

Cada etapa é autocontida: mantém suas próprias listas de opções/constantes e handlers locais de
adicionar/remover para sub-itens repetíveis (ex: `naturezas`, `unidadesMoveis`, `denuncias` em `StepBasics`),
usando `uid()` de `src/lib/utils.ts` para gerar os ids dos itens da lista.

**A derivação de progresso/status é centralizada**, não fica em cada componente: `src/lib/utils.ts` tem
`stepProgress(id, data)` (retorna de 0 a 1 por etapa, com base em quais campos obrigatórios estão preenchidos)
e `statusFromProgress(p)` (mapeia para `'pending' | 'partial' | 'complete'`). `HomeView.vue` calcula
`progresses`/`statuses`/`overall` a partir dessas funções e usa isso para alimentar a barra lateral de etapas,
os badges de status e a liberação da homologação (`canHomologate` exige que todas as etapas estejam
`'complete'`). Ao adicionar um novo campo obrigatório em uma etapa, atualize `stepProgress` correspondentemente,
senão o indicador de status daquela etapa não vai refletir a mudança.

**AudioRecorder** (`src/components/AudioRecorder.vue`) simula a gravação de um atendimento via
`MediaRecorder`/`getUserMedia` e emite `autoFill`, que `HomeView.vue` trata em `handleAutoFill()` preenchendo um
conjunto de valores mockados em `data.basicos`/`data.historico` — isso simula a futura funcionalidade de
transcrição de áudio para formulário e é um bom ponto de referência caso o comportamento de auto-preenchimento
mockado seja estendido.

**Os primitivos de UI** ficam em `src/components/ui/` (Button, Input, Select, Checkbox, RadioGroup, Label,
Textarea, Progress) e são wrappers finos em cima do Tailwind, geralmente repassando `class`/attrs e compondo
classes com `cn()` (`clsx` + `tailwind-merge`, em `src/lib/utils.ts`). Prefira esses componentes (`AppButton`,
`AppInput` etc.) em vez de elementos HTML crus ao construir a UI de uma etapa.

**Estilização** usa Tailwind CSS v4 (plugin `@tailwindcss/vite`, sem arquivo `tailwind.config.*` — o tema é
definido via `@theme inline` em CSS e custom properties em OKLCH em `src/styles.css`). As cores de status
específicas do domínio (`pending`/`partial`/`complete`, cada uma com variantes `-foreground` e `-soft`) e um
tema escuro (alternado pela classe `.dark`) estão definidos ali. Reutilize esses tokens (ex:
`bg-complete-soft text-complete`) em vez de fixar cores diretamente, para o tema escuro continuar funcionando.

**Alias de caminho**: `@/*` aponta para `src/*` (configurado tanto em `tsconfig.json` quanto em
`vite.config.ts`, via `vite-tsconfig-paths`).

**Roteamento**: `vue-router` está configurado (`src/router/index.ts`), mas a aplicação é, na prática, de rota
única (`/` → `HomeView`); ainda não há navegação multi-página a se preocupar.
