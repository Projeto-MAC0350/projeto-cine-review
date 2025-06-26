export interface Review {
  id: number;
  userId: number;
  movieId: number;
  comment?: string;
  rating: number;
  title?: string;
  date: string;
}
