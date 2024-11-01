import axios from 'axios';
import {Stock} from '../interfaces/Stock';

const API_KEY = 'oARPp9W0dsIizpPbqh4YpM9c0oSahtVx';
const BASE_URL = 'https://api.polygon.io/v3/reference/tickers';

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
        cik: stock.cik,
      })),
    };
    // return response.data.results.map((stock: Stock) => ({
    //   ticker: stock.ticker,
    //   name: stock.name,
    // }));
  } catch (error) {
    throw new Error('Error fetching stocks');
  }
};

export const nextBatch = async (next_url: string) => {
  try {
    const response = await axios.get(`${next_url}&apiKey=${API_KEY}`);
    return {
      next_url: next_url,
      data: response.data.results.map((stock: Stock) => ({
        ticker: stock.ticker,
        name: stock.name,
        cik: stock.cik,
      })),
    };
    // return response.data.results.map((stock: Stock) => ({
    //   ticker: stock.ticker,
    //   name: stock.name,
    // }));
  } catch (error) {
    throw new Error('Error fetching next stocks');
  }
};

export const fetchLogo = async (ticker: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/${ticker}?apiKey=${API_KEY}`);
    return (
      response.data.results?.branding?.logo_url + `?apiKey=${API_KEY}` || 'NA'
    );
  } catch (error) {
    console.error(`Error fetching logo for ${ticker}`, error);
    return null;
  }
};
