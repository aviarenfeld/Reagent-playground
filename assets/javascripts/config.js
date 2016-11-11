// Environment Options:

export default [options]

// Application Mapping:

export let BASE_PATHS = {
  BASE_URI: '',
  ASSET_URI: '/assets/',
  API_URI: '/api/v1'
}

// API Endpoints:

export let API = {
  SESSION_URL: BASE_PATHS.API_URI + '/session',
  RESET_PASSWORD_URL: BASE_PATHS.API_URI + '/reset-password',
  REPLACE_PASSWORD_URL: BASE_PATHS.API_URI + '/replace-password'
};