import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import VoterPage from "./Components/VoterPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/voter" element={<VoterPage />} />
    </Routes>
  );
};

export default AppRouter;
