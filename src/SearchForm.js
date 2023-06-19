import styled from "styled-components";
import InputWithLabel from "./InputWithLabel";

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

const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;

const StyledSearchForm = styled.form`
  padding: 10px 0px 20px 0px;
  display: flex;
  align-items: center;
`;

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => {
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
};

export { SearchForm as default, StyledButton };
