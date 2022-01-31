import React from "react";
import styled from "styled-components";
import Input from "./Input";

const InfoForm = ({ handleChange, handleSubmit }) => {
  return (
    <Wrapper onSubmit={handleSubmit}>
      <Input
        name="givenName"
        type="text"
        placeholder="First name"
        handleChange={handleChange}
      />
      <Input
        name="surname"
        type="text"
        placeholder="Last name"
        handleChange={handleChange}
      />
      <Input
        name="email"
        type="text"
        placeholder="Email"
        handleChange={handleChange}
      />
      <Confirm>
        <h2 type="submit">CONFIRM</h2>
      </Confirm>
    </Wrapper>
  );
};

export default InfoForm;

const Wrapper = styled.form`
  border: solid var(--color-alabama-crimson);
  padding: 20px;
`;

const Confirm = styled.button`
  background-color: var(--color-alabama-crimson);
`;
