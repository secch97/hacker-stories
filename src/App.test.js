/* eslint-disable testing-library/prefer-presence-queries */
/* eslint-disable jest/no-conditional-expect */
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
jest.mock('axios');

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

     test('Renders snapshot', () => { 
      const {container} = render(<SearchForm {...searchFormProps}></SearchForm>);
      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('App', () => { 
    test('Succeeds fetching data', async () => { 
      const promise = Promise.resolve({
        data: {
          hits:stories
        }
      });

      axios.get.mockImplementationOnce(() => promise);

      render(<App/>);
      screen.debug();
      // eslint-disable-next-line testing-library/prefer-presence-queries
      expect(screen.queryByText(/Loading/)).toBeInTheDocument();
      await act(() => promise);
      screen.debug();
      expect(screen.queryByText(/Loading/)).toBeNull();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Redux")).toBeInTheDocument();
      expect(screen.getAllByText("Dismiss").length).toBe(2);
     });

    test('Fails fetching data', async () => { 
      const promise2 = Promise.reject();
      axios.get.mockImplementationOnce(() => promise2);
      render(<App/>);
      expect(screen.getByText(/Loading/)).toBeInTheDocument();
      try{
        await act(()=>promise2);
      } catch(error){
        setTimeout(()=>{expect(screen.queryByText(/Loading/)).toBeNull();
        expect(screen.queryByText(/went wrong/)).toBeInTheDocument();},100);
        
      }
     });

     test('Removes a story', async () => { 
        const promise = Promise.resolve({
          data: {
            hits: stories,
          }
        });

        axios.get.mockImplementationOnce(()=>promise);
        render(<App></App>);
        await act(() => promise);
        expect(screen.getAllByText("Dismiss").length).toBe(2);
        expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
        fireEvent.click(screen.getAllByText("Dismiss")[0]);
        expect(screen.getAllByText("Dismiss").length).toBe(1);
        expect(screen.queryByText("Jordan Walke")).toBeNull();
      });

      test('Searches for specific stories', async () => { 
        const reactPromise = Promise.resolve({
          data: {
            hits: stories
          }
        });

        const anotherStory = {
          title: "Javascript",
          url: "https://en.wikipedia.org/wiki/Javascript",
          author: "Brendan Eich",
          num_comments: 15,
          points: 10,
          objectID: 3
        };

        const javascriptPromise = Promise.resolve({
          data: {
            hits: [anotherStory]
          }
        });

        axios.get.mockImplementation((url)=>{
          if(url.includes("React")) {
            return reactPromise;
          }
          else if(url.includes("Javascript")){
            return javascriptPromise;
          }
          else{
            throw Error();
          }
        });

        render(<App></App>);
        await act(()=>reactPromise);
        expect(screen.queryByDisplayValue("React")).toBeInTheDocument();
        expect(screen.queryByDisplayValue("Javascript")).toBeNull();
        expect(screen.queryByText("Jordan Walke")).toBeInTheDocument();
        expect(screen.queryByText("Dan Abramov, Andrew Clark")).toBeInTheDocument();
        expect(screen.queryByText("Brendan Eich")).toBeNull();

        fireEvent.change(screen.queryByDisplayValue("React"), {
          target: {
            value: "Javascript"
          }
        });

        expect(screen.queryByDisplayValue("React")).toBeNull();
        expect(screen.queryByDisplayValue("Javascript")).toBeInTheDocument();

        fireEvent.submit(screen.queryByText("Submit"));

        await act(()=> javascriptPromise);

        expect(screen.queryByText("Jordan Walke")).toBeNull();
        expect(screen.queryByText("Dan Abramov, Andrew Clark")).toBeNull();
        expect(screen.queryByText("Brendan Eich")).toBeInTheDocument();
       });


   });