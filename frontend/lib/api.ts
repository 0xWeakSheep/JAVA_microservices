const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001/api";

// 用户类型
export type User = {
  userId: number;
  username: string;
  email: string;
  permission: boolean;
  manager: boolean;
};

// 电影类型
export type Movie = {
  movieId: number;
  title: string;
  description?: string;
  releaseDate: string;
  runtime: number;
  posterImage: string;
  averageScore: number;
  genre?: string;
};

// 评论类型
export type Review = {
  reviewId?: number;
  movieId?: number;
  userId?: number;
  username?: string;
  title?: string;
  movieTitle?: string;
  content: string;
  score: number;
  createdAt: string;
  likes?: number;
  comments?: number;
  avatar?: string;
  role?: string;
  featured?: boolean;
};

// 日志类型
export type LogEntry = {
  id: number;
  methodName: string;
  userName: string;
  timestamp: string;
};

// 认证响应
export type AuthResponse = {
  token: string;
  user: User;
};

// API错误
export type ApiError = {
  message?: string;
};

// 获取存储的token
function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

// API请求基础函数
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "请求失败" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// 认证相关API
export const authApi = {
  // 登录
  login: (username: string, password: string): Promise<AuthResponse> =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  // 注册
  register: (username: string, password: string, email: string): Promise<User> =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password, email }),
    }),

  // 获取当前用户
  me: (): Promise<User> => apiRequest("/auth/me"),
};

// 电影相关API
export const movieApi = {
  // 获取所有电影
  getAll: (): Promise<Movie[]> => apiRequest("/movies"),

  // 搜索电影
  search: (title: string): Promise<Movie[]> =>
    apiRequest(`/movies?title=${encodeURIComponent(title)}`),

  // 获取电影详情
  getById: (movieId: number): Promise<Movie> =>
    apiRequest(`/movies/${movieId}`),

  // 创建电影（管理员）
  create: (movie: Omit<Movie, "movieId" | "averageScore">): Promise<Movie> =>
    apiRequest("/movies", {
      method: "POST",
      body: JSON.stringify(movie),
    }),

  // 更新电影（管理员）
  update: (movieId: number, movie: Partial<Movie>): Promise<Movie> =>
    apiRequest(`/movies/${movieId}`, {
      method: "PUT",
      body: JSON.stringify(movie),
    }),

  // 删除电影（管理员）
  delete: (movieId: number): Promise<void> =>
    apiRequest(`/movies/${movieId}`, {
      method: "DELETE",
    }),
};

// 评论相关API
export const reviewApi = {
  // 获取所有评论
  getAll: (): Promise<Review[]> => apiRequest("/reviews"),

  // 获取电影的评论
  getByMovieId: (movieId: number): Promise<Review[]> =>
    apiRequest(`/reviews?movieId=${movieId}`),

  // 获取用户的评论
  getByUserId: (userId: number): Promise<Review[]> =>
    apiRequest(`/reviews?userId=${userId}`),

  // 创建评论
  create: (review: Omit<Review, "reviewId" | "createdAt">): Promise<Review> =>
    apiRequest("/reviews", {
      method: "POST",
      body: JSON.stringify(review),
    }),

  // 更新评论
  update: (reviewId: number, review: Partial<Review>): Promise<Review> =>
    apiRequest(`/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(review),
    }),

  // 删除评论
  delete: (reviewId: number): Promise<void> =>
    apiRequest(`/reviews/${reviewId}`, {
      method: "DELETE",
    }),
};

// 日志相关API（管理员）
export const logApi = {
  // 获取所有日志
  getAll: (): Promise<LogEntry[]> => apiRequest("/logs"),
};

// 用户相关API（管理员）
export const userApi = {
  // 获取所有用户
  getAll: (): Promise<User[]> => apiRequest("/users"),

  // 更新用户权限
  updatePermission: (userId: number, permission: boolean): Promise<User> =>
    apiRequest(`/users/${userId}/permission?value=${permission}`, {
      method: "PATCH",
    }),
};
