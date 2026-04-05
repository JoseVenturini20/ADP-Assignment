import axios, { AxiosResponse } from 'axios';
import { TaskResponse } from '../types/Transaction.types';

const BASE_URL = 'https://interview.adpeai.com/api/v2';

export const getTask = async (): Promise<TaskResponse> => {
  const response: AxiosResponse<TaskResponse> = await axios.get(`${BASE_URL}/get-task`);
  return response.data;
};

export const submitTask = async (id: string, result: string[]): Promise<AxiosResponse> => {
  const response: AxiosResponse = await axios.post(`${BASE_URL}/submit-task`, { id, result });
  return response;
};
