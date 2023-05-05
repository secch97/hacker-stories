import { useEffect, useReducer, useRef, useState } from "react";

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

const App = () => {

  const initialStories = [
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

  const getAsyncStories = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            stories: initialStories,
          },
        });
      }, 2000);
    });
  };

  /* 
    ======================
    =       HOOKS        =
    ======================     
  */
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const [stories, dispatchStories] = useReducer(storiesReducer, {
      data: [],
      isLoading: false,
      isError: false
    });

  useEffect(() => {
    dispatchStories({type: "STORIES_FETCH_INIT"});

    getAsyncStories().then((result) => {
      dispatchStories({
      type: "STORIES_FETCH_SUCCESS",
      payload: result.data.stories
      });
    }).catch(() => {
      dispatchStories({type: "STORIES_FETCH_FAILURE"});
    });
  }, []);

  /* 
    ======================
    =      HANDLERS      =
    ======================     
  */
  const handleSearch = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
  };

  const handleRemoveStory = (objectID) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: objectID
    });  
  };

  /* 
    ======================
    =       HELPERS      =
    ======================     
  */
  const searchedStories = stories.data.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearch}
        isFocused
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <hr />
      {stories.isError && (<p>Something went wrong...</p>)}
      {
        stories.isLoading ? 
        (<p>Loading...</p>) : 
        (<List list={searchedStories} onRemoveItem={handleRemoveStory} />)
      }

    </>
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
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </div>
  );
};

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
    <li>
      <span>
        <a href={url}>{title}</a>
      </span>
      <span> {author}</span>
      <span> {num_comments}</span>
      <span> {points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(objectID)}>
          Dismiss
        </button>
      </span>
    </li>
  );
};

export { App as default };
