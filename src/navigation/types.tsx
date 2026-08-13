export type Action = {
  type: 'GO_BACK';
  source?: string;
  target?: string;
}


export type Navigation = {
  navigate: (scene: string, data?: any) => void;
  goBack(): Action;
};
