/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import StarRating from "./StarRating";


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "dcc12605";

// ========== Categoria: Structural ==========
export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  
  // const [watched, setWatched] = useState([]);
  // Vamos passar um callback na useState para restaurar do localstorage ou array vazio
  const [watched, setWatched] = useState(function(){
    const storedValue = localStorage.getItem('watched');
    // vamos retornar o valor armazenado como state inicial.
    return JSON.parse(storedValue) || []
  });

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    
  }

  function handleDeleteWatched(id){
    setWatched(watched => watched.filter(movie => movie.imdbID !== id))
  }

  // Armazenando o histórico de assistidos localmente.
  useEffect(function(){
    localStorage.setItem('watched', JSON.stringify(watched))
  }, [watched])

  useEffect(
    function () {
      // AbortController serve para interromper muitas requisições à api e deixar sempre a mais recente.
      // É uma API do browser e não tem a ver com o React.
      // A função será retornada no final
      const controller = new AbortController()

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal}
          );

          // Se der erro na chamada da API
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          // Se der bom na chamada da API
          const data = await res.json();
          // Se determinado parâmetro da API for falso, mostre um erro.
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          
          
          if(err.name !== "AbortError") {
            console.log(err.message);

            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      // Colocando pra funcionar depois de 3 caracteres
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      handleCloseMovie();
      fetchMovies();

      return function(){
        controller.abort();
      }
    },
    [query]
  );
  //

 

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} onDeleteWatched={handleDeleteWatched}/>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}

// ========== Categoria: Structural ==========
function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

// ========== Categoria: Structural ==========
function Main({ children }) {
  return <main className="main">{children}</main>;
}

// ========== Category: Stateful ==========
function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

// ========== Category: Stateless / Presentational ==========
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

// ========== Category: Stateless / Presentational ==========
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

// ========== Category: Stateless ==========
// Mesmo recebendo uma prop, ele não tem State)
function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)} key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  /* Quando selecionado o filme único, ele vai fazer uma busca na API com o ID selecionado
  Este filme selecionado será desestruturado (destructuring) para criar várias variáveis
  Estas variáveis criadas são passadas para dentro da função handleAdd.
  Dentro do handeAdd ele cria um objeto que será passado como argumento para a função onAddWatched
  A função onAddWatched está adicionando o objeto/conteúdo que foi passado a uma array usando o spread.
  
  */
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      // O código abaixo divide a tempo em um array, depois pega o primeiro el
      // Se o texto for 120 minutos, ele vai separar em 2 itens "120" e "minutos"
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
 

      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          // Aqui colocamos o controller como segundo argumento da API
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        // Colocando o filme selecionado no Movie
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  // Mudar o título da página dinamicamente. Cada efeito deve ter um único propósito
  useEffect(function(){
    if(!title) return;
    document.title = `Movie | ${title}`

    // Aqui é a função de Clean Up do useEffect
    // Ela deve fazer uma única coisa. Aqui estamos resetando o title para usePopCorn App
    return function(){
      document.title = 'usePopCorn App'
    }
  }, [title]);

  useEffect(function(){
    function callback(e) {if(e.code === 'Escape'){
      onCloseMovie();}
     }
    document.addEventListener('keydown', callback);
    return function(){
      document.removeEventListener('keydown', callback)
    }
   }, [onCloseMovie]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>

            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? 
              <>
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={setUserRating}
              />

              {userRating > 0 ? (
                <button className="btn-add" onClick={handleAdd}>
                  + Add to list
                </button>
              ) : (
                ""
              )}
              </> : <p>You rated with movie {watchedUserRating}<span>⭐</span></p>}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring: {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

// ========== Category: Stateful ==========

// ========== Category: Stateless ==========
// Possui variável mas não possui state
function WatchedSummary({ watched }) {
  console.log(watched)
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched}/>
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button className="btn-delete" onClick={()=>onDeleteWatched(movie.imdbID)}>X</button>
      </div>
    </li>
  );
}
