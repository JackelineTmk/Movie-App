import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRatings, type RatingResponse } from '../services/backend';

export function RatedMovies() {
  const [ratedMovies, setRatedMovies] = useState<RatingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Busca os filmes avaliados no Flask assim que a página carrega
  useEffect(() => {
    async function fetchRatings() {
      try {
        const data = await getRatings();
        setRatedMovies(data);
      } catch (err) {
        setError('Error loading your rated movies.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRatings();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: '#ff4a4a' }}>{error}</p>;

  return (
    <div>
      <h2>My Rated Movies</h2>
      
      {ratedMovies.length === 0 ? (
        <p>You haven't rated any movies yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {ratedMovies.map((movie) => (
            <Link 
              to={`/movie/${movie.tmdb_id}`} 
              key={movie.id} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ border: '1px solid #4cf', padding: '10px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', height: '100%', backgroundColor: '#1a1a1a' }}>
                
                {movie.poster_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                    alt={`Pôster do filme ${movie.title}`} 
                    style={{ width: '100%', borderRadius: '4px' }}
                  />
                ) : (
                  <div style={{ height: '270px', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                    No Poster
                  </div>
                )}
                
                <h4 style={{ margin: '10px 0 5px 0', fontSize: '16px' }}>{movie.title}</h4>
                
                {/* Exibição da nota */}
                <div style={{ backgroundColor: '#4caf50', color: 'white', padding: '5px', borderRadius: '4px', display: 'inline-block', fontWeight: 'bold' }}>
                  Rating: {movie.rating} / 5
                </div>
              
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}