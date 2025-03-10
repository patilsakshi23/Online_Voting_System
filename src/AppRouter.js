import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import VoterPage from "./Pages/VoterPage";
import Registration from "./Pages/Registration.js";

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
