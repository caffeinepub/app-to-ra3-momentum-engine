// TrueData API Configuration
// Base URL for TrueData REST API endpoints
export const TRUEDATA_BASE_URL = 'https://history.truedata.in';

// API endpoints
export const TRUEDATA_ENDPOINTS = {
  // Get last N ticks for a symbol
  getLastNTicks: '/getlastnticks',
  // Get last N bars for a symbol
  getLastNBars: '/getlastnbars',
  // Get LTP (Last Traded Price) for a single symbol
  getLTP: '/getlastnticks',
  // Get LTP for multiple symbols in bulk
  getLTPBulk: '/getLTPBulk',
  // Get symbol option chain (includes OI data)
  getSymbolOptionChain: '/getSymbolOptionChain',
  // Get symbol expiry list
  getSymbolExpiryList: '/getSymbolExpiryList',
} as const;

// Rate limiting configuration
export const RATE_LIMIT = {
  maxCallsPerMinute: 60,
  maxCallsPerDay: 10000,
} as const;

// Symbol format for NIFTY in TrueData API
export const NIFTY_SYMBOL = 'NIFTY';
export const NIFTY_INDEX_SYMBOL = 'NIFTY-I';

// Default expiry format (YYMMDD)
export const DEFAULT_EXPIRY_FORMAT = 'YYMMDD';
