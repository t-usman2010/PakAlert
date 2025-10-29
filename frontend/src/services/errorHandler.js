// services/errorHandler.js
export class ApiError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function handleApiError(error) {
  if (error instanceof ApiError) {
    return error;
  }

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return new ApiError(
      error.response.data.error || 'Server error',
      error.response.status,
      error.response.data.details || null
    );
  } else if (error.request) {
    // The request was made but no response was received
    return new ApiError(
      'No response from server',
      0,
      'The server is not responding. Please check your internet connection.'
    );
  } else {
    // Something happened in setting up the request that triggered an Error
    return new ApiError(
      'Request failed',
      0,
      error.message
    );
  }
}

export function isNetworkError(error) {
  return !error.response && error.request;
}

export function isServerError(error) {
  return error.response && error.response.status >= 500;
}

export function isClientError(error) {
  return error.response && error.response.status >= 400 && error.response.status < 500;
}

export function getErrorMessage(error) {
  if (error instanceof ApiError) {
    return error.details || error.message;
  }
  return error.message || 'An unknown error occurred';
}