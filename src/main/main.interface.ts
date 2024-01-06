export interface Blacklist {
  id: number;
  qq: string;
  bilibili: string;
  reason: string;
  violateTime: string;
  updateAt: string;
}

export const SortByList = [
  'id',
  'qq',
  'bilibili',
  'reason',
  'violateTime',
  'updateAt',
];
