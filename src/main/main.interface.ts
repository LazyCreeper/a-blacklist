export interface Blacklist {
  id: number;
  qq: string;
  email: string;
  reason: string;
  violateTime: string;
  updateAt: string;
}

export const SortByList = [
  'id',
  'qq',
  'email',
  'reason',
  'violateTime',
  'updateAt',
];
