import { useState } from "react";


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

  console.log("App renders");

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

  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  console.log("Search renders");

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange}/>

      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
    </div>
  );
};

const List = ({list}) => {
  console.log("List renders");
  return (
    <ul>
        {
          list.map((listItem) => (
            <Item 
              key={listItem.objectID}
              listItem={listItem}
            />
          ))
        }
    </ul>
  );
} 

const Item = ({listItem}) => {
  console.log("Item renders")
  return (
    <li>
      <span>
        <a href={listItem.url}>{listItem.title}</a>
      </span>
      <span> {listItem.author}</span>
      <span> {listItem.num_comments}</span>
      <span> {listItem.points}</span>
    </li>
  );
};

export { 
  App as default, 
};
