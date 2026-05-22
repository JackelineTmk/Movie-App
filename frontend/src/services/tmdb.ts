import axios from 'axios';

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    accept: 'application/json',
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
export const searchMovies = async (query: string, page: number = 1): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query,
        include_adult: false,
        page: page 
      }
    });
    return response.data.results;
  } catch (error) {
    console.error("Error searching for movies:", error);
    throw error;
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
        append_to_response: 'credits'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error searching for details:", error);
    throw error;
  }
};