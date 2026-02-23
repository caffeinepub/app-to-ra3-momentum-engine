import { TRUEDATA_BASE_URL, TRUEDATA_ENDPOINTS, NIFTY_SYMBOL } from '@/config/trueDataConfig';

export interface TrueDataLTPResponse {
  symbol: string;
  ltp: number;
  timestamp: string;
}

export interface TrueDataOptionChainItem {
  strike: number;
  callOI: number;
  putOI: number;
  callLTP: number;
  putLTP: number;
}

export interface TrueDataExpiryResponse {
  symbol: string;
  expiries: string[];
}

class TrueDataService {
  private bearerToken: string | null = null;

  setBearerToken(token: string) {
    this.bearerToken = token;
  }

  getBearerToken(): string | null {
    return this.bearerToken;
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string>): Promise<T> {
    if (!this.bearerToken) {
      throw new Error('TrueData API token not configured. Please set your token in settings.');
    }

    const url = new URL(TRUEDATA_BASE_URL + endpoint);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error('Authentication failed. Please check your TrueData API token.');
      }

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      if (!response.ok) {
        throw new Error(`TrueData API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch data from TrueData API');
    }
  }

  async getNiftyLTP(): Promise<number> {
    try {
      const response = await this.makeRequest<any>(TRUEDATA_ENDPOINTS.getLTP, {
        symbol: 'NIFTY-I',
        bidask: '1',
        response: 'json',
        nticks: '1',
        interval: 'tick',
      });

      // Parse CSV response (TrueData returns CSV even with response=json for some endpoints)
      if (typeof response === 'string') {
        const lines = response.trim().split('\n');
        if (lines.length > 1) {
          const data = lines[1].split(',');
          return parseFloat(data[1]) || 0;
        }
      }

      return 0;
    } catch (error) {
      console.error('Error fetching NIFTY LTP:', error);
      throw error;
    }
  }

  async getNiftyOptionChain(expiry: string): Promise<{ totalCallOI: number; totalPutOI: number }> {
    try {
      const response = await this.makeRequest<any>(TRUEDATA_ENDPOINTS.getSymbolOptionChain, {
        symbol: NIFTY_SYMBOL,
        expiry: expiry,
        response: 'json',
      });

      // Parse option chain data to calculate total Call OI and Put OI
      let totalCallOI = 0;
      let totalPutOI = 0;

      if (typeof response === 'string') {
        const lines = response.trim().split('\n');
        for (let i = 1; i < lines.length; i++) {
          const data = lines[i].split(',');
          if (data.length >= 10) {
            totalCallOI += parseFloat(data[4]) || 0; // Call OI column
            totalPutOI += parseFloat(data[9]) || 0; // Put OI column
          }
        }
      }

      return { totalCallOI, totalPutOI };
    } catch (error) {
      console.error('Error fetching NIFTY option chain:', error);
      throw error;
    }
  }

  async getNiftyExpiryDates(): Promise<string[]> {
    try {
      const response = await this.makeRequest<any>(TRUEDATA_ENDPOINTS.getSymbolExpiryList, {
        symbol: NIFTY_SYMBOL,
        response: 'json',
      });

      if (typeof response === 'string') {
        const lines = response.trim().split('\n');
        const expiries: string[] = [];
        for (let i = 1; i < lines.length; i++) {
          const expiry = lines[i].trim();
          if (expiry) {
            expiries.push(expiry);
          }
        }
        return expiries;
      }

      return [];
    } catch (error) {
      console.error('Error fetching NIFTY expiry dates:', error);
      throw error;
    }
  }
}

export const trueDataService = new TrueDataService();
