import { useEffect, useState } from "react";

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) ?? initialState);

  useEffect(() => {
    localStorage.setItem(key, value.trim());
  }, [value, key]);

  return [value, setValue];
;}


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

  /* 
    ======================
    =       HOOKS        =
    ======================     
  */
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  
  /* 
    ======================
    =      HANDLERS      =
    ======================     
  */
  const handleSearch = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
  };
  /* 
    ======================
    =       HELPERS      =
    ======================     
  */
  const searchedStories = stories.filter((story) => (story.title.toLowerCase()).includes(searchTerm.toLowerCase().trim()));

  return (
    <>
      <h1>My Hacker Stories</h1>
      <InputWithLabel id="search" label="Search: " value={searchTerm} onInputChange={handleSearch}/>
      <hr />
      <List list={searchedStories}/>
    </>
  );
};

const InputWithLabel = ({id, label, value, type="text", onInputChange}) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} value={value} onChange={onInputChange}/>
    </div>
  );
};

const List = ({list}) => {
  return (
    <ul>
        {
          list.map(({objectID, ...listItem}) => (
            <Item 
              key={objectID}
              {...listItem}
            />
          ))
        }
    </ul>
  );
} 

const Item = ({title, url, author, num_comments, points}) => {
  return (
    <li>
      <span>
        <a href={url}>{title}</a>
      </span>
      <span> {author}</span>
      <span> {num_comments}</span>
      <span> {points}</span>
    </li>
  );
};

export { 
  App as default, 
};
