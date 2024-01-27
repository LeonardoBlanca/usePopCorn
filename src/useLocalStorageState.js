import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  // Vamos passar um callback na useState para restaurar do localstorage ou array vazio
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    // vamos retornar o valor armazenado como state inicial.
    // Se não houver nenhum, vai retornar o array vazio que foi passado na App.jsx ln 24
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  // Armazenando o histórico de assistidos localmente.
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );
  return [value, setValue];
}
