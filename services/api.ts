import axios, {AxiosError} from 'axios';
import {Stock} from '../interfaces/Stock';
import secrets from '../secrets';

const API_KEY = secrets.API_KEY;
const BASE_URL = secrets.BASE_URL;

// Fetch stock with query
export const fetchStocks = async (query: string = '') => {
  try {
    const limit: number = 20;
    const response = await axios.get(
      `${BASE_URL}?apiKey=${API_KEY}&market=stocks&exchange=XNAS&search=${query}&limit=${limit}`,
    );
    const next_url: string | null = response.data.next_url;
    return {
      next_url: next_url,
      data: response.data.results.map((stock: Stock) => ({
        ticker: stock.ticker,
        name: stock.name,
        composite_figi: stock.composite_figi,
      })),
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      if (error.response?.status === 429) {
        // Display error if reached api limit
        throw new Error(
          'Error fetching stocks due to exceeding allowed api limit per min',
        );
      }
    throw new Error('Error fetching stocks');
  }
};

// Fetch next batch of stocks
export const nextBatch = async (next_url: string) => {
  try {
    const response = await axios.get(`${next_url}&apiKey=${API_KEY}`);
    return {
      next_url: next_url,
      data: response.data.results.map((stock: Stock) => ({
        ticker: stock.ticker,
        name: stock.name,
        composite_figi: stock.composite_figi,
      })),
    };
  } catch (error) {
    if (axios.isAxiosError(error))
      if (error.response?.status === 429) {
        // Display error if reached api limit
        throw new Error(
          'Error fetching stocks due to exceeding allowed api limit per min',
        );
      }
    throw new Error('Error fetching next stocks');
  }
};

// Fetch logo for a stock
export const fetchLogo = async (ticker: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/${ticker}?apiKey=${API_KEY}`);
    return response.data.results?.branding?.logo_url || 'NA';
  } catch (error) {
    if (axios.isAxiosError(error))
      if (error.response?.status === 429) {
        // Display error if reached api limit
        throw new Error(
          `Error fetching for ${ticker} due to exceeding allowed api limit per min`,
        );
      }
    throw new Error(`Error fetching logo for ${ticker}`);
  }
};
