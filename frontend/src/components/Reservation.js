import React from "react";
import styled from "styled-components";
import { useEffect, useState } from "react";

const Reservation = () => {
  const [reservation, setReservation] = useState([]);
  const confirmation = JSON.parse(
    window.sessionStorage.getItem("confirmation")
  );

  console.log(confirmation);

  const { _id } = confirmation;

  useEffect(() => {
    const fetchReservation = async () => {
      const res = await fetch(`/api/reservations/${_id}`);
      const info = await res.json();
      const { status, data } = info;
      if (status === 200) {
        setReservation(data);
      } else {
        window.alert(data);
      }
    };

    fetchReservation();
  }, [_id]);

  return (
    <Main>
      Here is your Reservation
      <ReservationOrder>
        <li>Reservation #:{reservation._id}</li>
        <li>Flight #:{reservation.flight}</li>
        <li>seat #:{reservation.seat}</li>
        <li>
          Name:{reservation.givenName} {reservation.surName}
        </li>
        <li>Email:{reservation.email}</li>
      </ReservationOrder>
    </Main>
  );
};

export default Reservation;

const Main = styled.div``;

const ReservationOrder = styled.ol``;
