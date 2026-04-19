// Frontend runtime config.
// Update API_BASE for each environment (local, staging, production).
window.APP_CONFIG = window.APP_CONFIG || {};
window.APP_CONFIG.API_BASE = window.APP_CONFIG.API_BASE || `${window.location.protocol}//${window.location.hostname}:5000/api`;
