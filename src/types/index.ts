export type StepId = 'basics' | 'people' | 'items' | 'history' | 'attachments'
export type Status = 'pending' | 'partial' | 'complete'

export interface StepDef {
  id: StepId
  title: string
  description: string
}

export interface Nature {
  id: string
  name: string
  attempted: boolean
}

export interface MobileUnit {
  id: string
  agency: string
  unit: string
  vehiclePrefix: string
  badgeNumber: string
  name: string
  occurrenceNumber: string
}

export interface LinkedReport {
  id: string
  number: string
  year: string
  issuingAgency: string
}

export interface Person {
  id: string
  name: string
  type: string
  document: string
}

export interface Item {
  id: string
  category: string
  description: string
  licensePlate: string
}

export interface Attachment {
  id: string
  name: string
  type: string
}

export interface FormState {
  basics: {
    occurrenceType: string
    classification: string
    registrationUnit: string
    investigationUnit: string
    inFlagrante: string
    reportSource: string
    reportDate: string
    periodStart: string
    periodEnd: string
    motivation: string
    policeOperation: string
    operationName: string
    event: string
    eventName: string
    country: string
    state: string
    cityDistrict: string
    block: string
    street: string
    streetNumber: string
    complement: string
    coordinates: string
    natures: Nature[]
    mobileUnits: MobileUnit[]
    linkedReports: LinkedReport[]
  }
  people: Person[]
  items: Item[]
  history: string
  attachments: Attachment[]
}

export interface Participant {
  id: string
  name: string
  role: string
  at: string
}
