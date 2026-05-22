import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchMovies } from '../services/tmdb';
import type { Movie } from '../services/tmdb';

export function Home() {
  // Estados da aplicação
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Função disparada ao clicar no botão de buscar
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário
    
    if (!query.trim()) return; // Não busca se o campo estiver vazio

    setIsLoading(true);
    setError(''); // Limpa erros anteriores

    try {
      const results = await searchMovies(query);
      setMovies(results);
    } catch (err) {
      setError('Erro ao buscar filmes. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Buscar Filmes</h2>
      
      {/* 3. Formulário de Busca */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite o nome do filme..."
          style={{ padding: '8px', width: '100%', maxWidth: '400px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {/* 4. Feedback de Erro */}
      {error && <p style={{ color: '#ff4a4a' }}>{error}</p>}

      {/* 5. Listagem dos Resultados (Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
        {movies.map((movie) => (
          
          <Link 
            to={`/movie/${movie.id}`} 
            key={movie.id} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ border: '1px solid #444', padding: '10px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', height: '100%' }}>
              
              {movie.poster_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                  alt={`Pôster do filme ${movie.title}`} 
                  style={{ width: '100%', borderRadius: '4px' }}
                />
              ) : (
                <div style={{ height: '270px', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                  Sem Pôster
                </div>
              )}
              
              <h4 style={{ margin: '10px 0 0 0', fontSize: '16px' }}>{movie.title}</h4>
            
            </div>
          </Link>
        ))}
      </div>
        
    </div>
  );
}
