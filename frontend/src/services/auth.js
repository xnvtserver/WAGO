// front-end/src/services/auth.js
import { apiFetch } from '@/utils/api';
import { useAuthStore } from '@/stores/auth';
export default {
  async login(email, password, remember) {
    try {
      const API_BASE = import.meta.env.VITE_API_URL;// || 'http://localhost:3000/api/v1'
      console.log('API_BASE:', API_BASE);
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      if (!response.ok) {
      console.error('Backend error response:', data);
      throw new Error(data.message || 'Login failed');
      }
      return data;
    } catch (error) {
      // Show backend-originated errors clearly
    if (error.message.includes('relation "users" does not exist')) {
      throw new Error('Backend misconfiguration: users table is missing.');
    }

    console.error('Auth login error:', error);
    throw new Error(error.message || 'Unexpected login error');
    }
  },
  async logout() {
    const authStore = useAuthStore();
    await apiFetch('/v1/auth/logout', { method: 'POST' });
    authStore.clearAuth();  // Use store's method instead of `this`
  },
  async refreshToken() {
    const authStore = useAuthStore();
    try {
      const data = await apiFetch('/v1/auth/refresh');
      authStore.token = data.token;
      return true;
    } catch (error) {
      authStore.clearAuth();
      return false;
    }
  }
};



// This JavaScript module, auth.js, serves as a dedicated service for handling authentication-related operations in a Vue.js frontend application. It encapsulates the logic for user login, logout, and access token refreshing by interacting with a backend API. It leverages a central authentication store (likely Pinia, given useAuthStore) to manage and persist authentication state (like tokens and user data) across the application. The module is designed to make API calls, handle responses, and manage errors gracefully, ensuring a clear separation of concerns for authentication logic.

// Key Functionalities

// User Login (login function):

// Authenticates a user by sending their email and password to the backend API's /auth/login endpoint.
// Handles the API response, parsing JSON data.
// Performs error handling for failed login attempts (e.g., incorrect credentials, server errors).
// Returns the data from the server upon successful login (this data likely includes an access token and user information).
// The remember parameter is defined but not used within this function's current implementation.
// User Logout (logout function):

// Logs out the currently authenticated user.
// Makes an API call to the backend's /v1/auth/logout endpoint to invalidate the session/token on the server-side.
// Clears the authentication state (token, user details) from the local authStore using authStore.clearAuth().
// Token Refresh (refreshToken function):

// Attempts to obtain a new access token from the backend's /v1/auth/refresh endpoint, typically when the current access token has expired.
// If successful, it updates the token in the authStore with the new token received from the API.
// Returns true on successful token refresh.
// If the refresh attempt fails (e.g., refresh token is invalid or expired), it clears the authentication state from the authStore (effectively logging the user out) and returns false.
// Key Elements and Components

// apiFetch utility (@/utils/api):
// A custom utility function used for making API requests (seen in logout and refreshToken). It likely handles common API call configurations like setting base URLs, default headers (e.g., Authorization with a bearer token), and possibly global error handling or request/response interception.
// useAuthStore (@/stores/auth):
// A hook/function to access a Pinia (or similar Vue state management library) store dedicated to authentication.
// Key store interactions:
// authStore.clearAuth(): A method within the store to remove all authentication-related data (token, user profile).
// authStore.token = data.token: Setting the new token in the store after a successful refresh. The login function returns data which would then be used (likely by the calling component or another store action) to set the initial token and user data in the store.
// API Endpoint Configuration:
// VITE_API_URL: An environment variable used to define the base URL for the API. It defaults to http://localhost:3000/api/v1 if the environment variable is not set.
// Specific endpoints used:
// POST /auth/login (explicitly constructed URL)
// POST /v1/auth/logout (uses apiFetch, implying base URL is prepended)
// /v1/auth/refresh (uses apiFetch, method likely GET or POST based on apiFetch default or configuration)
// Standard Workspace API:
// Used directly in the login function for the login request, with manual construction of headers and body.
// Error Handling:
// try...catch blocks are used in all asynchronous operations to catch and handle errors.
// Checks response.ok to determine if an HTTP request was successful.
// Throws custom Error objects with messages from the server response or default messages.
// Logs errors to the console (console.error).
// JSON Handling:
// JSON.stringify() to convert JavaScript objects to JSON strings for request bodies.
// response.text() followed by JSON.parse() to handle API responses, including cases where the response body might be empty.
// Outline of Usage in the Frontend Application

// Initialization & Configuration:

// The VITE_API_URL environment variable should be configured to point to the correct backend API URL.
// The authStore (Pinia store) needs to be set up with actions and state properties to hold the token, user information, and authentication status.
// Login Process:

// A login component (e.g., a login page/form) would import this authService.
// When the user submits their credentials, the component would call authService.login(email, password).
// Upon successful login, the component would receive the user data and token. It would then likely dispatch an action to the authStore to store this information and update the application's authentication state (e.g., redirecting the user to a dashboard).
// Logout Process:

// A logout button or action in the UI would call authService.logout().
// This service handles both the API call to the backend and clearing the local authentication state in the authStore.
// The application would then typically redirect the user to the login page or a public area.
// Token Management & API Calls:

// The apiFetch utility (or an Axios interceptor if used) would likely be configured to:
// Automatically include the authentication token (retrieved from authStore) in the headers of outgoing requests to protected API endpoints.
// Detect 401 (Unauthorized) errors, which usually indicate an expired token.
// Upon a 401 error, it would call authService.refreshToken().
// If refreshToken() returns true, the original failed API request would be retried with the new token.
// If refreshToken() returns false, the user is effectively logged out (as clearAuth() is called by refreshToken), and the application should handle this by redirecting to the login page.
// Route Protection & Conditional Rendering:

// Vue Router navigation guards would use the authStore (whose state is managed indirectly by this authService) to check if a user is authenticated before allowing access to protected routes.
// Components would also use the authStore to conditionally render UI elements based on the user's authentication status or role.
// Relationship to "Core Entities & Their Relationships"

// Users Entity: This auth.js service directly interacts with the concept of a User.

// The login function takes email and password as input, which are key fields of the Users entity. The backend would validate these against the password_hash.
// Upon successful authentication, the backend likely returns user details (name, email, role) from the Users table. This information would be stored in the authStore.
// The role field is particularly important as it determines the user's permissions, which link to Shop_Permissions and dictate what actions they can perform regarding Shops, Products, Price_History, etc.
// Access Control: While this service doesn't manage permissions directly, it is the entry point. Successful authentication via auth.js is the prerequisite for the frontend to then use the authenticated user's role (obtained during login and stored in authStore) to:

// Determine which shops a user can view or manage.
// Control access to functionalities like manage_inventory or view_dashboard based on Shop_Permissions.
// Attribute changes in Price_History to the correct changed_by user.