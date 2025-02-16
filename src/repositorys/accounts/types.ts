interface account {
  id: number;
  name: string;
  modified: string;
  sort: number;
  active: number;
  local_id: number;
  website_id: number;
  parent_account_id: number;
};

export interface accountResponse {
  accounts: account[];
  requested: string;
};
