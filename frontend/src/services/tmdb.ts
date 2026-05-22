import axios from 'axios';

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    accept: 'application/json',
    // Pega o token do nosso arquivo .env.local
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
  }
});

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
}

interface SearchResponse {
  results: Movie[];
}

// Função que faz a busca dos filmes
export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  
  try {
    const response = await tmdbApi.get<SearchResponse>('/search/movie', {
      params: {
        query: query,
        language: 'pt-BR', // Traz os dados em português
        include_adult: false,
      }
    });
    
    return response.data.results;
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    throw error; // Repassa o erro para o componente tratar (mostrar loading/erro)
  }
};

export interface CastMember {
  id: number;
  name: string;
  character: string;
}

export interface MovieDetails extends Movie {
  credits: {
    cast: CastMember[];
  };
}

export const getMovieDetails = async (id: string | number): Promise<MovieDetails> => {
  try {
    const response = await tmdbApi.get<MovieDetails>(`/movie/${id}`, {
      params: {
        language: 'pt-BR',
        append_to_response: 'credits' // Isso traz o elenco junto na mesma requisição!
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes do filme:", error);
    throw error;
  }
};