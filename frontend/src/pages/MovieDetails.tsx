import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, type MovieDetails as MovieDetailsType } from '../services/tmdb';
import { getRatings, addRating, updateRating, deleteRating } from '../services/backend';

export function MovieDetails() {
  const { id } = useParams<{ id: string }>(); // Pega o ID da URL
  const navigate = useNavigate();

  // Estados
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(5); // Padrão 5 estrelas
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setIsLoading(true);
        // 1. Busca os detalhes do filme 
        const movieData = await getMovieDetails(id);
        setMovie(movieData);

        // 2. Vê no Flask se este filme já tem avaliação
        const savedRatings = await getRatings();
        const currentRating = savedRatings.find(r => r.tmdb_id === Number(id));
        
        if (currentRating) {
          setUserRating(currentRating.rating);
          setSelectedRating(currentRating.rating); // Salva a nota
        }
      } catch (err) {
        setError('Error loading the informations.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id]);

  // Ações do Banco de Dados
  const handleSaveRating = async () => {
    if (!movie || !id) return;
    try {
      await addRating({
        tmdb_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        rating: selectedRating
      });
      setUserRating(selectedRating);
    } catch (err) {
      alert('Error saving the ratings.');
    }
  };

  const handleUpdateRating = async () => {
    if (!id) return;
    try {
      await updateRating(Number(id), selectedRating);
      setUserRating(selectedRating);
    } catch (err) {
      alert('Error updating rating.');
    }
  };

  const handleDeleteRating = async () => {
    if (!id) return;
    try {
      await deleteRating(Number(id));
      setUserRating(null);
      setSelectedRating(5); // Reseta o padrão
    } catch (err) {
      alert('Error removing rating.');
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error || !movie) return <p style={{ color: 'red' }}>{error || 'Movie not found.'}</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer' }}>
        ← Back
      </button>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* Pôster */}
        {movie.poster_path && (
          <img 
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
            alt={movie.title} 
            style={{ borderRadius: '8px', maxHeight: '450px' }}
          />
        )}

        {/* Informações */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2>{movie.title}</h2>
          <p><strong>Release date:</strong> {movie.release_date}</p>
          
          <h3>Synopsis</h3>
          <p>{movie.overview || 'No synopsis is available.'}</p>

          {/* Seção de Avaliação */}
          <div style={{ backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
            <h3>Your rating</h3>
            
            {userRating !== null ? (
              <div>
                <p>You rated this movie: <strong>{userRating} / 5</strong></p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select 
                    value={selectedRating} 
                    onChange={(e) => setSelectedRating(Number(e.target.value))}
                    style={{ padding: '5px' }}
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <button onClick={handleUpdateRating} style={{ cursor: 'pointer' }}>Editar Nota</button>
                  <button onClick={handleDeleteRating} style={{ backgroundColor: '#ff4a4a', color: 'white', cursor: 'pointer' }}>Remover</button>
                </div>
              </div>
            ) : (
              <div>
                <p>You haven't rated this movie yet.</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select 
                    value={selectedRating} 
                    onChange={(e) => setSelectedRating(Number(e.target.value))}
                    style={{ padding: '5px' }}
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <button onClick={handleSaveRating} style={{ cursor: 'pointer', backgroundColor: '#4caf50', color: 'white' }}>Save rating</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Elenco */}
      <div style={{ marginTop: '40px' }}>
        <h3>Main cast</h3>
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', padding: 0, listStyle: 'none' }}>
          {movie.credits.cast.slice(0, 6).map(actor => (
            <li key={actor.id} style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '4px' }}>
              <strong>{actor.name}</strong>
              <span style={{ display: 'block', fontSize: '13px', color: '#aaa' }}>as {actor.character}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}