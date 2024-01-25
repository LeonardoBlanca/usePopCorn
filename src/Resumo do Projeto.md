# Este conteúdo ensina os seguintes tópicos:
- Split Components
- Component Categories
- Component Composition
- Reusability


## Componente Movie Detais

Aqui tem 2 States: Movie e isLoading.
- Quando selecionado o filme único, ele vai fazer uma busca na API com o ID selecionado
- Este filme selecionado será desestruturado (destructuring) para criar várias variáveis (title, poster, imdbID, etc)
- No Botão "Add to Watchlist" tem a função handleAdd no onClick. Também vai fechar o modal usando a self invoked função onCloseMovie().
- Estas variáveis criadas são acessadas pela função handleAdd (Já que estão no mesmo escopo)
- Dentro do handeAdd ele cria um objeto (newWatchedMovie) que será passado como argumento para a função self invoked onAddWatched(newWatchedMovie) <br>
(Presente no App e passada para o Box, depois MovieDetails via props)
- A função onAddWatched está adicionando o objeto/conteúdo que foi passado a uma array usando o spread.<br><br>

Para pegar a nota que o usuário vai dar, vamos usar a função que já definimos no componente StarRating.<br>
A função do StarRating é a onSetRating.<br>
Criamos um novo estado em MovieDetais para representar a nota do usuário [userRating, setUserRating].<br>
Depois de criarmos o state, vamos passar ele para o StarRating: onSetRating={setUserRating}.<br><br>

Lembrando que também devo passar para o handleAdd o userRating que é o meu state criado agora a pouco.<br>
Fez uma renderização condicional para que o botão apareça apenas quando a nota for maior do que zero. Fez abaixo do StarRating<br>

## useEffect
É usado para colocar as funções que causam efeito colateral. Estamos usando para fazer o fetch e para mudar o título da aplicação.<br>
Esta função aceita opcionalmente uma cleanup function (função de limpeza). Usamos o effect para mudar o título e o cleanup para voltar ao normal.(linha ~318 a ~330)<br>
