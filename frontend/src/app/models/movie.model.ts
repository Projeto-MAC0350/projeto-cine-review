export interface Movie {
  id: number;
  title: string;
  showLink?: string;
  movieLink?: string;
  imageLink?: string;
  sessions?: string;
  movieInfo?: string;
  country?: string;
  countryType?: string;
  year?: string;
  yearType?: string;
  duration?: string;
  durationType?: string;
  director?: string;
  directorType?: string;
  exhibitionId: number;
  noReviews: number;
  totalRating: number;
}
