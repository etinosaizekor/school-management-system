export interface PageOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult {
  items: any[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
    limit: number;
  };
}
