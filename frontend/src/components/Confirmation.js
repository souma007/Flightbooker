import React from "react";
import styled from "styled-components";

import tombstone from "../assets/tombstone.png";

const Confirmation = () => {
  const confirmation = JSON.parse(
    window.sessionStorage.getItem("confirmation")
  );

  return (
    <Wrapper>
      <FlightInfo>
        Your flight is confirmed!
        <li>Reservation #:{confirmation._id}</li>
        <li>Flight #:{confirmation.flight}</li>
        <li>seat #:{confirmation.seat}</li>
        <li>
          Name:{confirmation.givenName} {confirmation.surName}
        </li>
        <li>Email:{confirmation.email}</li>
      </FlightInfo>
      <Tomb src={tombstone} />
    </Wrapper>
  );
};

export default Confirmation;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FlightInfo = styled.ol``;

const Tomb = styled.img`
  height: 200px;
  width: 200px;
`;
