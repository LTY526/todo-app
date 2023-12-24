export interface QueryParams<T> {
  page: number;
  size: number;
  searchTerm: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  predicates: ((item: T) => boolean)[] | undefined;
}