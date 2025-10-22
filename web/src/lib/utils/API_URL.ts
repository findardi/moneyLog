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
  private static baseURL = getBaseURL();

  static setBaseURL(url: string): void {
    this.baseURL = url;
  }

  static getBaseURL(): string {
    return this.baseURL;
  }

  static readonly user = {
    register: () => `${API_URL.baseURL}/user`,
    login: () => `${API_URL.baseURL}/user/login`,
    activated: (params?: { token?: string }) =>
      `${API_URL.baseURL}/user/activated${params ? builderQueryString(params) : ""}`,
  };

  static readonly token = {
    reset: () => `${API_URL.baseURL}/token/reset`,
    generate: () => `${API_URL.baseURL}/token`,
  };
}

export type APIEndpoint = () => string;

export const buildURL = (endpoint: APIEndpoint | string): string => {
  return typeof endpoint === "function" ? endpoint() : endpoint;
};

export default API_URL;
