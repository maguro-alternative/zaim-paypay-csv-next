export interface MoneyParams {
  [key: string]: string | number | boolean | readonly string[] | readonly number[] | readonly boolean[] | null | undefined;
  mapping?: number;
  category_id?: number;
  genre_id?: number;
  mode?: "payment" | "income" | "transfer";
  order?: "id" | "date";
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  group_by?: "receipt_id";
}

interface money {
  id: number;
  mode: string;
  user_id: number;
  date: string;
  category_id: number;
  genre_id: number;
  to_account_id: number;
  from_account_id: number;
  amount: number;
  comment: string;
  active: number;
  name: string;
  receipt_id: number;
  place: string;
  created: string;
  currency_code: string;
};

export interface MoneyResponse {
  money: money[];
  requested: string;
};
