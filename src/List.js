import styled from "styled-components";
import StyledButton from "./SearchForm";

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

  width: ${(props) => props.width}
`;

const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;

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
    <StyledItem>
      <StyledColumn width="40%">
        <a href={url}>{title}</a>
      </StyledColumn>
      <StyledColumn width="30%"> {author}</StyledColumn>
      <StyledColumn width="10%"> {num_comments}</StyledColumn>
      <StyledColumn width="10%"> {points}</StyledColumn>
      <StyledColumn width="10%">
        <StyledButtonSmall type="button" onClick={() => onRemoveItem(objectID)}>
          Dismiss
        </StyledButtonSmall>
      </StyledColumn>
    </StyledItem>
  );
};

export { List as default };
