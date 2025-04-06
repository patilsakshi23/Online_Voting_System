import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import VoterAuth from "./Admin/VoterAuthentication.js";
import Registration from "./Voter/Registration.js";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import VoterDashboard from "./Voter/VoterDashboard";
import AdminDashboard from "./Admin/AdminDashboard";
import VoteCandidate  from "./Admin/VoteCandidate.js";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/voter-authentication" element={<VoterAuth />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/voter-dashboard" element={<VoterDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/vote-candidate" element={<VoteCandidate />} />

    </Routes>
  );
};

export default AppRouter;
