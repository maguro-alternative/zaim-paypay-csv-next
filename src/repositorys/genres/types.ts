interface genre {
  id: number;
  name: string;
  sort: number;
  active: number;
  category_id: number;
  parent_genre_id: number;
  modified: string;
};

export type GenreResponse = {
  genres: genre[];
  requested: string;
};
