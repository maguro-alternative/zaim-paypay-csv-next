export interface Income {
  mapping: number;
  category_id: number;
  amount: number;
  date: string;
  to_account_id: number;
  place: string;
  comment: string;
};

interface money {
  id: number;
  place_uid: string;
  modified: string;
};

interface place {
  id: number;
  user_id: number;
  category_id: number;
  account_id: number;
  transfer_account_id: number;
  mode: string;
  place_uid: string;
  service: string;
  name: string;
  original_name: string;
  tel: string;
  count: number;
  place_pattern_id: number;
  calc_flag: number;
  edit_flag: number;
  active: number;
  modified: string;
  created: string;
};

interface user {
  input_count: number;
  repeat_count: number;
  day_count: number;
  data_modified: string;
};

export interface IncomeResponse {
  money: money;
  place: place;
  user: user;
  requested: string;
};
