import React from "react";
import styled from "styled-components";

const Input = ({ name, type, placeholder, handleChange }) => {
  return (
    <Wrapper>
      <label htmlFor={name}></label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={(ev) => handleChange(ev.target.value, name)}
      />
    </Wrapper>
  );
};

export default Input;

const Wrapper = styled.div``;
