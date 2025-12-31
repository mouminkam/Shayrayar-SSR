import axios from "axios";
import { getLanguage } from "../../lib/getLanguage";
import { getAuthToken } from "../../lib/getAuthToken";

/**
 * Create axios instance for Server Components
 * Automatically injects Accept-Language and Authorization headers from request headers
 * @returns {Promise<AxiosInstance>} Configured axios instance
 */
export async function createServerAxios() {
  const language = await getLanguage();
  const token = await getAuthToken();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shahrayar.peaklink.pro/api/v1';

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Accept-Language": language,
  };

  // Add Authorization header if token is available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers,
  });
}

