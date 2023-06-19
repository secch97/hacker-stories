import { useEffect, useRef } from "react";
import styled from "styled-components";
import styles from "./App.module.css";

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

  export {
    InputWithLabel as default
  }