export type StepId = 'basicos' | 'pessoas' | 'objetos' | 'historico' | 'anexos'
export type Status = 'pending' | 'partial' | 'complete'

export interface StepDef {
  id: StepId
  title: string
  description: string
}

export interface Natureza {
  id: string
  nome: string
  tentadaConsumada: string
}

export interface UnidadeMovel {
  id: string
  orgao: string
  unidade: string
  prefixoViatura: string
  matricula: string
  nome: string
  numOcorrencia: string
}

export interface DenunciaVinculada {
  id: string
  numero: string
  ano: string
  orgaoGerador: string
}

export interface Pessoa {
  id: string
  nome: string
  tipo: string
  documento: string
}

export interface Objeto {
  id: string
  categoria: string
  descricao: string
  placa: string
}

export interface Anexo {
  id: string
  nome: string
  tipo: string
}

export interface FormState {
  basicos: {
    tipoOcorrencia: string
    classificacao: string
    unidadeRegistro: string
    unidadeApuracao: string
    flagrante: string
    origemComunicacao: string
    dataComunicacao: string
    periodoInicio: string
    periodoFim: string
    motivacao: string
    operacaoPolicial: string
    nomeOperacao: string
    evento: string
    nomeEvento: string
    pais: string
    estado: string
    cidadeRA: string
    quadra: string
    logradouro: string
    via: string
    complemento: string
    coordenadas: string
    naturezas: Natureza[]
    unidadesMoveis: UnidadeMovel[]
    denuncias: DenunciaVinculada[]
  }
  pessoas: Pessoa[]
  objetos: Objeto[]
  historico: string
  anexos: Anexo[]
}

export interface Participante {
  id: string
  nome: string
  papel: string
  em: string
}
