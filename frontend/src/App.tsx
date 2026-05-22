import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { RatedMovies } from './pages/RatedMovies';
import { MovieDetails } from './pages/MovieDetails';

function App() {
  return (
    <BrowserRouter>
      {/* Barra de Navegação Simples */}
      <header style={{ padding: '1rem', backgroundColor: '#242424', color: 'white' }}>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ color: '#646cff', textDecoration: 'none' }}>Home Page</Link>
          <Link to="/avaliados" style={{ color: '#646cff', textDecoration: 'none' }}>Rated Movies</Link>
        </nav>
      </header>

      {/* Área onde as páginas serão renderizadas */}
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/avaliados" element={<RatedMovies />} />
          
          {/* 2. A rota do filme precisa estar EXATAMENTE aqui dentro do <Routes> */}
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;