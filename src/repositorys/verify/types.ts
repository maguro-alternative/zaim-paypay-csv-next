interface me {
  id: number;
  login: string;
  name: string;
  input_count: number;
  day_count: number;
  repeat_count: number;
  day: string;
  week: string;
  month: string;
  currency_code: string;
  profile_image_url: string;
  cover_image_url: string;
  profile_modified: string;
};

export interface VerifyResponse {
  me: me;
  requested: string;
};
