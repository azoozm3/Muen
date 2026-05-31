export const roles = ["patient", "doctor", "nurse", "volunteer", "admin"];

export const requestStatuses = [
  "pending",
  "accepted",
  "on_the_way",
  "arrived",
  "resolved",
  "cancelled",
];

export const specialties = [
  "General Medicine",
  "Cardiology",
  "Pediatrics",
  "Gynecology",
  "Orthopedics",
  "Neurology",
  "Emergency Medicine",
];

// Request Status Constants
export const REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected'
};

// Timeout Constants (in milliseconds)
export const TIMEOUTS = {
  TOAST_NOTIFICATION: 5000,
  API_REQUEST: 30000,
  DEBOUNCE_SEARCH: 300,
  DEBOUNCE_DEFAULT: 500,
  SESSION_TIMEOUT: 1800000,
  RETRY_DELAY: 1000
};

// Rating Constants
export const RATINGS = {
  EXCELLENT: 5,
  VERY_GOOD: 4.5,
  GOOD: 4,
  FAIR: 3,
  POOR: 2,
  VERY_POOR: 1,
  MINIMUM: 1,
  EXCELLENT_THRESHOLD: 4.5,
  GOOD_THRESHOLD: 4
};

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  LARGE_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 50,
  MAX_RESULTS: 100,
  DEFAULT_PAGE: 1
};

// UI Constants
export const UI = {
  TOAST_DURATION: 5000,
  MODAL_ANIMATION_DURATION: 300,
  LOADING_DELAY: 200
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.'
};
