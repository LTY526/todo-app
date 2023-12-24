export interface QueryParams {
  page: number;
  size: number;
  searchTerm: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}