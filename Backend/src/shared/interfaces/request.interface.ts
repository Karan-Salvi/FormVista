export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchQuery {
  search?: string;
  searchFields?: string[];
}

export interface FilterQuery {
  filters?: Record<string, unknown>;
}

export interface BaseQuery extends PaginationQuery, SearchQuery, FilterQuery {}
