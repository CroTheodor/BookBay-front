export interface HttpResponse<T>{
  message: string;
  success: boolean;
  response: T;
}

export interface PaginatedResponse<T>{
  page: number;
  limit: number;
  totalPages: number;
  content: T[];
}

export interface PaginatedRequest{
  page: number;
  limit: number;
}
