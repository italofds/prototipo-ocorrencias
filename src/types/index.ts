export type StepId = 'basicos' | 'pessoas' | 'objetos' | 'historico' | 'anexos'
export type Status = 'pending' | 'partial' | 'complete'

export interface StepDef {
  id: StepId
  title: string
  description: string
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
    natureza: string
    data: string
    hora: string
    endereco: string
    bairro: string
    municipio: string
    uf: string
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
