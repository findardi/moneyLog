import { env } from "$env/dynamic/private";

const getBaseURL = (): string => {
  return env.BASE_API_URL;
};

const builderQueryString = (params: Record<string, any>): string => {
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    );

  return filtered.length > 0 ? `?${filtered.join("&")}` : "";
};

export class API_URL {
  private static baseURL: string = getBaseURL();

  static setBaseURL(url: string): void {
    this.baseURL = url;
  }

  static getBaseURL(): string {
    return this.baseURL;
  }

  static readonly user = {
    register: () => `${API_URL.baseURL}/user`,
    login: () => `${API_URL.baseURL}/user/login`,
    verify: () => `${API_URL.baseURL}/user/verify`,
    activated: (params?: { token?: string }) =>
      `${API_URL.baseURL}/user/activated${params ? builderQueryString(params) : ""}`,
  };

  static readonly token = {
    reset: () => `${API_URL.baseURL}/token/reset`,
    generate: () => `${API_URL.baseURL}/token`,
  };

  static readonly expense = {
    getAll: (params?: {
      offset?: number;
      limit?: number;
      sort?: string;
      order_by?: string;
      category?: string;
      name?: string;
      minAmount?: number;
      maxAmount?: number;
      startDate?: string;
      endDate?: string;
      date?: string;
    }) =>
      `${API_URL.baseURL}/expense${params ? builderQueryString(params) : ""}`,

    delete: (id: string) => `${API_URL.baseURL}/expense/${id}`,
    get: (id: string) => `${API_URL.baseURL}/expense/${id}`,
    update: (id: string) => `${API_URL.baseURL}/expense/${id}`,
    top: () => `${API_URL.baseURL}/expense/top`,
    insert: () => `${API_URL.baseURL}/expense`,
  };

  static readonly dashboard = {
    notification: () => `${API_URL.baseURL}/periode-limit/notifications/stream`,
  }

  static readonly limit = {
    insert: () => `${API_URL.baseURL}/spending`,
    delete: (id: string) => `${API_URL.baseURL}/spending/${id}`,
    update: (id: string) => `${API_URL.baseURL}/spending/${id}`,
    get: () => `${API_URL.baseURL}/spending`,
  }
}

export type APIEndpoint = () => string;

export const buildURL = (endpoint: APIEndpoint | string): string => {
  return typeof endpoint === "function" ? endpoint() : endpoint;
};

export default API_URL;
