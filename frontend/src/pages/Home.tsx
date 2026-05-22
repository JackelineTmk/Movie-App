import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchMovies, type Movie } from '../services/tmdb';

export function Home() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // NOVO: Estado para o filtro de ano
  const [yearFilter, setYearFilter] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    try {
      const results = await searchMovies(query);
      setMovies(results);
      // Resetar o filtro ao fazer uma nova busca
      setYearFilter(''); 
    } catch (err) {
      setError('Erro ao buscar filmes.');
    } finally {
      setIsLoading(false);
    }
  };

  // Lógica de filtragem: 
  // Se 'yearFilter' estiver vazio, mostra todos. 
  // Se tiver algo, filtra os filmes que começam com aquele ano.
  const filteredMovies = movies.filter((movie) => {
    if (!yearFilter) return true;
    return movie.release_date?.startsWith(yearFilter);
  });

  return (
    <div>
      <h2>Buscar Filmes</h2>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite o nome do filme..."
          style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '8px 16px' }}>
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {/* NOVO: Interface do Filtro */}
      {movies.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
          <label htmlFor="year-filter" style={{ marginRight: '10px' }}>Filtrar por ano:</label>
          <input
            id="year-filter"
            type="number"
            placeholder="Ex: 2024"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #444', width: '80px' }}
          />
          {yearFilter && (
            <button 
              onClick={() => setYearFilter('')} 
              style={{ marginLeft: '10px', fontSize: '12px', cursor: 'pointer' }}
            >
              Limpar Filtro
            </button>
          )}
          <span style={{ marginLeft: '15px', color: '#aaa', fontSize: '14px' }}>
            Resultados encontrados: {filteredMovies.length}
          </span>
        </div>
      )}

      {error && <p style={{ color: '#ff4a4a' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
        {/* IMPORTANTE: Usamos o 'filteredMovies' em vez de 'movies' para renderizar */}
        {filteredMovies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #444', padding: '10px', borderRadius: '8px', textAlign: 'center', height: '100%' }}>
              {movie.poster_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                  alt={movie.title} 
                  style={{ width: '100%', borderRadius: '4px' }}
                />
              ) : (
                <div style={{ height: '270px', backgroundColor: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Sem Pôster</div>
              )}
              <h4 style={{ margin: '10px 0 0 0', fontSize: '16px' }}>{movie.title}</h4>
              <p style={{ fontSize: '12px', color: '#aaa' }}>{movie.release_date?.split('-')[0] || 'N/A'}</p>
            </div>
          </Link>
        ))}
      </div>

      {movies.length > 0 && filteredMovies.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Nenhum filme encontrado para o ano {yearFilter}.</p>
      )}
    </div>
  );
}