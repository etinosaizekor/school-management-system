export interface IFindResult {
  items: any[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
    limit: number;
  };
}
