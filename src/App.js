import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import axios from "axios";
import styles from "./App.module.css";
import styled from "styled-components";
import { memo } from "react";

const StyledContainer = styled.div`
  height: 100vw;
  padding: 20px;
  background: #83a4d4;
  background: linear-gradient(to left, #b6fbff, #83a4d4);
  color: #171212;
`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300px;
  letter-spacing: 2px;
`;

const StyledItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

const StyledColumn = styled.span`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow ellipsis;

  a {
    color: inherit;
  }

  width: ${(props)=>props.width}
`;

const StyledButton = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;
  transition: all 0.1s ease-in;

  &:hover {
    background: #171212;
    color: #ffffff;
  }
`; 

const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;

const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;

const StyledSearchForm = styled.form`
  padding: 10px 0px 20px 0px;
  display: flex;
  align-items: center;
`;

const StyledLabel = styled.label`
border-top: 1px solid #171212;
border-left: 1px solid #171212;
padding-left: 5px;
font-size: 24px;
`;
const StyledInput = styled.input`
border: none;
border-bottom: 1px solid #171212;
background-color: transparent;
font-size: 24px;
`;

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

const getSumComments = (stories) => {
  console.log("C");
  return stories.data.reduce(
    (result, value) => result + value.num_comments, 0
  );
};

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

  const handleRemoveStory = useCallback((objectID) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: objectID
    });  
  }, []);

  console.log("B:App");
  const sumComments = useMemo(
    () => getSumComments(stories),
    [stories]
  );

  return (
    <StyledContainer>
      <StyledHeadlinePrimary>My Hacker Stories with {sumComments}</StyledHeadlinePrimary>
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
    </StyledContainer>
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
      <StyledLabel htmlFor={id} className={styles.label}>{children}</StyledLabel>
      &nbsp;
      <StyledInput
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        className={styles.input}
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
    <StyledSearchForm onSubmit={onSearchSubmit}>
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={onSearchInput}
      >
        <strong>Search: </strong>
      </InputWithLabel>
      <StyledButtonLarge type="submit" disabled={!searchTerm}>
        Submit
      </StyledButtonLarge>
    </StyledSearchForm>
  );
}

const List = memo(
  ({ list, onRemoveItem }) => {
  console.log("B:List");
  return(
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
}
);

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
    <StyledItem>
      <StyledColumn width="40%">
        <a href={url}>{title}</a>
      </StyledColumn>
      <StyledColumn width="30%"> {author}</StyledColumn>
      <StyledColumn width="10%"> {num_comments}</StyledColumn>
      <StyledColumn width="10%"> {points}</StyledColumn>
      <StyledColumn width="10%"> 
        <StyledButtonSmall 
          type="button" 
          onClick={() => onRemoveItem(objectID)}
        >
        </StyledButtonSmall>
      </StyledColumn>
    </StyledItem>
  );
};

export { App as default };
