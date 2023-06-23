import styled from "styled-components";
import {StyledButton} from "./SearchForm";
import { useRef, useState } from "react";
import { sortBy } from "lodash";

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

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, "title"),
  AUTHOR: (list) => sortBy(list, "author"),
  COMMENT: (list) => sortBy(list, "num_comments").reverse(),
  POINT: (list) => sortBy(list, "points").reverse()
}

const List = ({ list, onRemoveItem }) => {

  const [sort, setSort] = useState({
    sortKey: "NONE",
    isReverse: false
  });
  console.log(sort.sortKey);

  const handleSort = (sortKey) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({sortKey: sortKey, isReverse: isReverse});
  };

  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse ? sortFunction(list).reverse() : sortFunction(list);

  return (
    <ul>
      <StyledItem>
        <StyledColumn width="40%">
          <button style={sort.sortKey === "TITLE" ? {backgroundColor: "black", color: "white"}:{}} type="button" onClick={() => handleSort("TITLE")}>
            Title
          </button>
          </StyledColumn>
        <StyledColumn width="30%">
          <button style={sort.sortKey === "AUTHOR" ? {backgroundColor: "black", color: "white"}:{}} type="button" onClick={() => handleSort("AUTHOR")}>
            Author
          </button>
        </StyledColumn>
        <StyledColumn width="10%">
          <button style={sort.sortKey === "COMMENT" ? {backgroundColor: "black", color: "white"}:{}} type="button" onClick={() => handleSort("COMMENT")}>
            Comments
          </button>
        </StyledColumn>
        <StyledColumn width="10%">
          <button style={sort.sortKey === "POINT" ? {backgroundColor: "black", color: "white"}:{}} type="button" onClick={() => handleSort("POINT")}>
            Points
          </button>
        </StyledColumn>
        <StyledColumn width="10%">Actions</StyledColumn>
      </StyledItem>
      {sortedList.map((listItem) => (
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
      <StyledColumn width="30%">{author}</StyledColumn>
      <StyledColumn width="10%">{num_comments}</StyledColumn>
      <StyledColumn width="10%">{points}</StyledColumn>
      <StyledColumn width="10%">
        <StyledButtonSmall type="button" onClick={() => onRemoveItem(objectID)}>
          Dismiss
        </StyledButtonSmall>
      </StyledColumn>
    </StyledItem>
  );
};

export { List as default };
