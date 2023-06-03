import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import axios from "axios";
import './App.css'

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) ?? initialState);

  useEffect(() => {
    localStorage.setItem(key, value.trim());
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch(action.type) {
    case "STORIES_FETCH_INIT":
      return{
        ...state,
        isLoading: true,
        isError:false
      }
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload !== story.objectID
        )
      };
    default:
      throw new Error();
  };
};

//A
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const App = () => {
  /* 
    ======================
    =       HOOKS        =
    ======================     
  */
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);
  const [stories, dispatchStories] = useReducer(storiesReducer, {
      data: [],
      isLoading: false,
      isError: false
    });

  
  const handleFetchStories = useCallback(async ()=>{
    dispatchStories({type: "STORIES_FETCH_INIT"});
    try{
      const result = await axios.get(url);
      dispatchStories({
        type:"STORIES_FETCH_SUCCESS",
        payload: result.data.hits
      });
    }
    catch{
      dispatchStories({type: "STORIES_FETCH_FAILURE"});
    }
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  /* 
    ======================
    =      HANDLERS      =
    ======================     
  */


  const handleSearchInput = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
  };

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  const handleRemoveStory = (objectID) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: objectID
    });  
  };

  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>
      <SearchForm 
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      {stories.isError && (<p>Something went wrong...</p>)}
      {
        stories.isLoading ? 
        (<p>Loading...</p>) : 
        (<List list={stories.data} onRemoveItem={handleRemoveStory} />)
      }
    </div>
  );
};

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  isFocused,
  children,
}) => {
  //A
  const inputRef = useRef();

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <div>
      <label htmlFor={id} className="label">{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        className="input"
      />
    </div>
  );
};

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit
}) => {
  return (
    <form onSubmit={onSearchSubmit} className="search-form">
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={onSearchInput}
      >
        <strong>Search: </strong>
      </InputWithLabel>
      <button type="submit" disabled={!searchTerm} className="button button_large">
        Submit
      </button>
    </form>
  );
}

const List = ({ list, onRemoveItem }) => {
  return (
    <ul>
      {list.map((listItem) => (
        <Item
          key={listItem.objectID}
          {...listItem}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </ul>
  );
};

const Item = ({
  objectID,
  title,
  url,
  author,
  num_comments,
  points,
  onRemoveItem,
}) => {
  return (
    <li className="item">
      <span style={{width: "40%"}}>
        <a href={url}>{title}</a>
      </span>
      <span style={{width: "30%"}}> {author}</span>
      <span style={{width: "10%"}}> {num_comments}</span>
      <span style={{width: "10%"}}> {points}</span>
      <span style={{width: "10%"}}> 
        <button 
          type="button" 
          onClick={() => onRemoveItem(objectID)}
          className="button button_small">
          Dismiss
        </button>
      </span>
    </li>
  );
};

export { App as default };
