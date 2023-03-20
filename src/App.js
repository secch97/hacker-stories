

const App = () => {

  const stories = [
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

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search/>
      <hr />
      <List list={stories}/>
    </div>
  );
};

const Search = () => {

  const handleChange = (event) => {
    console.log(event.target.value);
  };

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange}/>
    </div>
  );
};

const List = (props) => {
  return (
    <ul>
        {
          props.list.map((listItem) => (
            <Item 
              key={listItem.objectID}
              listItem={listItem}
            />
          ))
        }
    </ul>
  );
} 

const Item = (props) => {
  return (
    <li>
      <span>
        <a href={props.listItem.url}>{props.listItem.title}</a>
      </span>
      <span> {props.listItem.author}</span>
      <span> {props.listItem.num_comments}</span>
      <span> {props.listItem.points}</span>
    </li>
  );
};

export { 
  App as default, 
};
