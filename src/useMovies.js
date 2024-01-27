import { useState, useEffect } from "react";

const KEY = "dcc12605";

// O Default ele usa apenas para componentes. Não é obrigatório, mas apenas para separar
export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      // Se o callback existir, ele será executado.
      callback?.();
      // AbortController serve para interromper muitas requisições à api e deixar sempre a mais recente.
      // É uma API do browser e não tem a ver com o React.
      // A função será retornada no final
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
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
          if (err.name !== "AbortError") {
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

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  // Retorno do Hook
  return { movies, isLoading, error };
}
