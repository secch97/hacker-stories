const games = ["The Last of Us", "God of War", "Dark Souls"];

function App() {
  return (
    <div>
      <h1>List of my top 3 games:</h1>
      <ol>
        {
          games.map((game) => (<li key={game}>{game}</li>))
        }
      </ol>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text"/>
    </div>
  );
}

export {
  App as default
}