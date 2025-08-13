import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getMatches = async () => {
  const response = await api.get('/matches/public');
  return response.data;
};

export const getMatchById = async (id: string) => {
  const response = await api.get(`/matches/public/${id}`);
  return response.data;
};

export const getLeagueStandings = async (id: string) => {
  const response = await api.get(`/leagues/${id}/standings`);
  return response.data;
};

export const getPlayerById = async (id: string) => {
  const response = await api.get(`/players/${id}`);
  return response.data;
};
