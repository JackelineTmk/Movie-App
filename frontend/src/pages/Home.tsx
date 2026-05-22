import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { searchMovies, type Movie } from '../services/tmdb';

export function Home() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  
  // ESTADOS PARA SCROLL INFINITO
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Função de busca principal (Reseta a lista para nova busca)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setPage(1); // Reseta para a página 1

    try {
      const results = await searchMovies(query, 1);
      setMovies(results);
      setHasMore(results.length > 0);
    } catch (err) {
      setError('Error searching movies.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para carregar mais filmes
  const loadMoreMovies = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const nextPage = page + 1;

    try {
      const newResults = await searchMovies(query, nextPage);
      if (newResults.length === 0) {
        setHasMore(false);
      } else {
        setMovies(prev => [...prev, ...newResults]); // Anexa os novos filmes
        setPage(nextPage);
      }
    } catch (err) {
      console.error("Error loading more movies.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, query]);

  // Monitor de Scroll
  useEffect(() => {
    const handleScroll = () => {
      // Verifica se o usuário chegou a 100px do fim da página
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 
        >= document.documentElement.offsetHeight
      ) {
        loadMoreMovies();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreMovies]);

  const filteredMovies = movies.filter((movie) => {
    if (!yearFilter) return true;
    return movie.release_date?.startsWith(yearFilter);
  });

  return (
    <div>
      <h2>Explore Movies</h2>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white' }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Search
        </button>
      </form>

      {/* Filtro por ano */}
      {movies.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
          <label>Filter by year: </label>
          <input
            type="number"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            style={{ padding: '5px', width: '80px', marginLeft: '10px' }}
          />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
        {filteredMovies.map((movie, index) => (
          <Link to={`/movie/${movie.id}`} key={`${movie.id}-${index}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #444', padding: '10px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#111' }}>
              {movie.poster_path ? (
                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} style={{ width: '100%', borderRadius: '4px' }} />
              ) : (
                <div style={{ height: '270px', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Poster</div>
              )}
              <h4 style={{ margin: '10px 0 5px 0' }}>{movie.title}</h4>
              <p style={{ color: '#aaa', fontSize: '12px' }}>{movie.release_date?.split('-')[0]}</p>
            </div>
          </Link>
        ))}
      </div>

      {isLoading && <p style={{ textAlign: 'center', margin: '20px' }}>Loading more movies...</p>}
      {!hasMore && movies.length > 0 && <p style={{ textAlign: 'center', margin: '20px', color: '#888' }}>You've reached the end!</p>}
    </div>
  );
}