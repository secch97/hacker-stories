/* eslint-disable testing-library/no-debugging-utils */
import React from 'react';

import App, {
  storiesReducer, 
  Item, 
  List, 
  SearchForm, 
  InputWithLabel
} from './App';

import {
  render,
  screen,
  fireEvent,
  act
} from "@testing-library/react"

import axios from 'axios';

/*
  Before we unit test our first React component, we will cover how to test
  just a JS function, in this case, storiesReducer and one of its actions.
*/

const storyOne = {
  title: "React",
  url: "https://reactjs.org",
  author: "Jordan Walke",
  num_comments: 3,
  points: 4,
  objectID: 0
};


const storyTwo = {
  title: "Redux",
  url: "https://redux.js.org",
  author: "Dan Abramov, Andrew Clark",
  num_comments: 2,
  points: 5,
  objectID: 1
};

const stories = [storyOne, storyTwo];

describe('storiesReducer', () => { 
  test("Removes a story from all stories", ()=>{

    const action = {
      type: "REMOVE_STORY",
      payload: storyOne.objectID
    };
    
    const state = {
      data: stories,
      isLoading: false,
      isError: false
    };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [storyTwo],
      isLoading: false, 
      isError: false
    };

    expect(newState).toStrictEqual(expectedState);
  });

  test('Stories fetch init', () => { 
    const state = {
      data: [],
      isLoading: false,
      isError: false
    };

    const action = {
      type: "STORIES_FETCH_INIT",
    };

    const newState = storiesReducer(state, action);
    const expectedState = {
      data: [],
      isLoading: true,
      isError: false
    }

    expect(newState).toStrictEqual(expectedState);
  });

  test('Stories fetch success', async () => { 
      const state = {
        data: [],
        isLoading: true,
        isError: false
      };

      const result = await axios.get("https://hn.algolia.com/api/v1/search?query=React");
      const action = {
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits
      }

      const newState = storiesReducer(state, action);

      const expectedState = {
        data: result.data.hits,
        isLoading: false,
        isError: false
      };
      expect(newState).toStrictEqual(expectedState);
   });
 });

 describe('Item component', () => { 
    test('Should render item component properties', () => { 
      render(<Item {...storyOne}/>);
      screen.debug();
      expect(screen.getByText("Jordan Walke")).toBeTruthy();
      expect(screen.getByText("React")).toHaveAttribute("href", "https://reactjs.org");
     });

     test('Renders a clickable dismiss button', () => { 
        render(<Item {...storyOne}></Item>);
        expect(screen.getByRole("button")).toBeInTheDocument();
      });

      test('Clicking the dismiss button calls the callback handler', () => { 
          const handleRemoveItem = jest.fn();

          render(<Item {...storyOne} onRemoveItem={handleRemoveItem}></Item>);
          fireEvent.click(screen.getByRole("button"));
          expect(handleRemoveItem).toHaveBeenCalledTimes(1);
       });
  });

  describe("SearchForm", () => {
    const searchFormProps = {
      searchTerm: "React",
      onSearchInput: jest.fn(),
      onSearchSubmit: jest.fn()
    };

    test('Renders the input field with its values', () => { 
      render(<SearchForm {...searchFormProps}/>);
      screen.debug();
      expect(screen.getByDisplayValue("React")).toBeInTheDocument();
     });

     test("Renders the correct label", () => {
      render(<SearchForm {...searchFormProps}/>);
      expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
     });

     test("Calls onSearchInput on input field change", ()=>{
      render(<SearchForm {...searchFormProps}/>);
      fireEvent.change(screen.getByDisplayValue("React"), {
        target: {value: "Redux"}
      });
      expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
     });

     test("Calls onSearchSubmit on button submit click", ()=>{
      render(<SearchForm {...searchFormProps}></SearchForm>);
      fireEvent.submit(screen.getByRole("button"));
      expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
     });
  });