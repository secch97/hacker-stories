const list = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: "Road to React",
    url: "https://www.roadtoreact.com/",
    author: "Robin Wieruch",
    num_comments: 10,
    points: 15,
    objectID: 2,
  },
];

function App() {
  return (
    <div>
      <h1>My Hacker Stories</h1>

      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />

      <hr />

      <ul>
        {list.map((listItem) => (
          <li key={listItem.objectID}>
            <span>
              <a href={listItem.url}> {listItem.title} </a>
            </span>
            <span> {listItem.author} </span>
            <span> {listItem.num_comments} </span>
            <span> {listItem.points} </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { App as default };
