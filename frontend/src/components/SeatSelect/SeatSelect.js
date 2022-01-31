import React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Plane from "./Plane";
import InfoForm from "./InfoForm";
import { useHistory } from "react-router-dom";

const SeatSelect = ({}) => {
  const initialState = {
    flight: "",
    seat: "",
    givenName: "",
    surname: "",
    email: "",
  };
  const [subStatus, setSubStatus] = useState("idle");
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);

  const history = useHistory();

  // Initialize my reservation
  const [formData, setFormData] = useState(initialState);

  const handleChange = (value, name) => {
    console.log(value);
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchFlights = async () => {
      const res = await fetch(`/api/flights`);
      const data = await res.json();
      console.log(data);
      setFlights(data.data);
    };

    fetchFlights();
  }, []);

  const handleFlightClick = (ev) => {
    ev.preventDefault();
    setSelectedFlight(ev.target.value);
    setFormData({ ...formData, flight: ev.target.value });
  };

  console.log(selectedFlight);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    console.log(formData);
    setSubStatus("pending");
    fetch("/api/reservations", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        const { status, data } = res;
        if (status === 201) {
          setSubStatus("confirmed");
          window.sessionStorage.setItem("confirmation", JSON.stringify(data));
          history.push("/confirmed");
        } else {
          setSubStatus("error");
        }
      });
  };

  return (
    <Wrapper>
      <Flights>
        <label for="flight">Flight Number :</label>
        <select
          name="flight"
          focus
          required
          value={selectedFlight}
          onChange={handleFlightClick}
        >
          <option>select a fight</option>
          {flights.map((flight) => {
            return (
              <option key={flight} value={flight}>
                {flight}
              </option>
            );
          })}
        </select>
      </Flights>
      <h2>Select your seat and Provide your information!</h2>
      <Reservation>
        <Plane flight={selectedFlight} handleChange={handleChange} />
        <InfoForm handleChange={handleChange} handleSubmit={handleSubmit} />
      </Reservation>
    </Wrapper>
  );
};

export default SeatSelect;

const Flights = styled.div`
  padding: 15px;
  background-color: red;
`;

const Reservation = styled.div`
  display: flex;
  align-items: center;
  margin: 30px 300px;
`;

const Wrapper = styled.div`
  background-color: var(--color-orange);
`;
