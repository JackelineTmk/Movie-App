import axios from 'axios';

const backendApi = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// o que o Flask espera receber e o que ele devolve
export interface RatingPayload {
  tmdb_id: number;
  title: string;
  poster_path: string;
  rating: number;
}

export interface RatingResponse extends RatingPayload {
  id: number;
}


// LER: Pega todos os filmes já avaliados
export const getRatings = async (): Promise<RatingResponse[]> => {
  const response = await backendApi.get<RatingResponse[]>('/ratings');
  return response.data;
};

// CRIAR: Salva uma nova nota
export const addRating = async (data: RatingPayload): Promise<RatingResponse> => {
  const response = await backendApi.post<RatingResponse>('/ratings', data);
  return response.data;
};

// ATUALIZAR: Edita uma nota existente
export const updateRating = async (tmdb_id: number, rating: number): Promise<RatingResponse> => {
  const response = await backendApi.put<RatingResponse>(`/ratings/${tmdb_id}`, { rating });
  return response.data;
};

// DELETAR: Remove a avaliação
export const deleteRating = async (tmdb_id: number): Promise<void> => {
  await backendApi.delete(`/ratings/${tmdb_id}`);
};