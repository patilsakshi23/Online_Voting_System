import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import VoterPage from "./Components/VoterPage";
import Registration from "./Components/Registration.js";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/voter" element={<VoterPage />} />
      <Route path="/register" element={<Registration />} />
    </Routes>
  );
};

export default AppRouter;
