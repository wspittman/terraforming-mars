export enum GlobalParameter {
  OCEANS = 'oceans',
  OXYGEN = 'oxygen',
  TEMPERATURE = 'temperature',
}

export const GLOBAL_PARAMETERS = [
  GlobalParameter.OCEANS,
  GlobalParameter.OXYGEN,
  GlobalParameter.TEMPERATURE,
] as const;
