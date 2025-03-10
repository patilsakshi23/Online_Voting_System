import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Online Voting System</h1>
      <button onClick={() => navigate("/voter")}>Voter</button>
      <button onClick={() => navigate("/register")}>Register</button>
    </div>
  );
};

export default Home;
