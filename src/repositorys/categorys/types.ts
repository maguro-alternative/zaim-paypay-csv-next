export interface Category {
  active: number;
  id: number;
  local_id: number;
  mode: string;
  modified: string;
  name: string;
  parent_category_id: number;
  sort: number;
};

export interface CategoryResponse {
  categories: Category[];
  requested: string;
};
