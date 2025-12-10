import axios from 'axios';

export function handleApiError(error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (!error.response) {
      return new Error('Network error. Please check your connection.');
    }
    return new Error(`Request failed with status ${error.response.status}`);
  }
  return error instanceof Error ? error : new Error('Unknown error');
}
