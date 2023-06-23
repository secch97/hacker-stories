import { useCallback, useEffect, useReducer, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import SearchForm from "./SearchForm";
import List from "./List";

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

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) ?? initialState);

  useEffect(() => {
    localStorage.setItem(key, value.trim());
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter((story) => action.payload !== story.objectID),
      };
    default:
      throw new Error();
  }
};

//A
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const extractSearchTerm = (url) => url.replace(API_ENDPOINT, "");

const getLastSearches = (urls) => urls
  .reduce((result, url, index) => {
    const searchTerm = extractSearchTerm(url);

    if(index===0) {
      return result.concat(searchTerm);
    }

    const previousSearchTerm = result[result.length-1];

    if(searchTerm===previousSearchTerm){
      return result;
    } else {
      return result.concat(searchTerm);
    }
  }, [])
  .slice(-6, -1)

const getUrl = (searchTerm) => `${API_ENDPOINT}${searchTerm}`;

const App = () => {
  /* 
    ======================
    =       HOOKS        =
    ======================     
  */
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const [urls, setUrls] = useState([
    getUrl(searchTerm),
  ]);
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    try {
      const lastUrl = urls[urls.length-1];
      const result = await axios.get(lastUrl);
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch (error) {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [urls]);

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
    handleSearch(searchTerm);
    event.preventDefault();
  };

  const handleRemoveStory = (objectID) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: objectID,
    });
  };

  const handleLastSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm);
  };

  const handleSearch = (searchTerm) => {
    const url = getUrl(searchTerm);
    setUrls(urls.concat(url));
  }

  const lastSearches= getLastSearches(urls);

  return (
    <StyledContainer>
      <StyledHeadlinePrimary>My Hacker Stories</StyledHeadlinePrimary>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      {lastSearches.map((searchTerm, index)=> (
        <button
          key={searchTerm+index}
          type="button"
          onClick={() => handleLastSearch(searchTerm)}
        >
          {searchTerm}
        </button>  
      ))}
      {stories.isError && <p>Something went wrong...</p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </StyledContainer>
  );
};

export { App as default };
