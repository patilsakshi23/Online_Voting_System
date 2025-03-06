import React, { useState } from "react";
import styled from "styled-components";
import maharashtraData from "../assets/Maharashtra.json"; // Importing JSON data

const CenteredWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Ensures the wrapper takes the full viewport height */
`;

const Container = styled.div`
  padding: 1.5rem;
  width: 32rem; /* Increased width */
  margin: 2rem auto;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.7rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 1rem;
  margin-bottom: 1rem;
  outline: none;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const Button = styled.button`
  width: 100%;
  background: #2563eb;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.81rem;

  &:hover {
    background: #1d4ed8;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const VoterPage = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const [subDistricts, setSubDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedDistrict("");
    setSelectedSubDistrict("");
    setSelectedVillage("");
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setSelectedSubDistrict("");
    setSelectedVillage("");

    const districtData = maharashtraData.districts.find(d => d.district === district);
    setSubDistricts(districtData ? districtData.subDistricts : []);
    setVillages([]);
  };

  const handleSubDistrictChange = (e) => {
    const subDistrict = e.target.value;
    setSelectedSubDistrict(subDistrict);
    setSelectedVillage("");

    const subDistrictData = subDistricts.find(sd => sd.subDistrict === subDistrict);
    setVillages(subDistrictData ? subDistrictData.villages : []);
  };

  return (
    <CenteredWrapper>
      <Container>
        <Title>Voter Authentication</Title>
        <p>Select your region and authenticate via face recognition.</p>

        <div>
          <Label>State</Label>
          <Select value={selectedState} onChange={handleStateChange}>
            <option value="">Select State</option>
            <option value="MH">Maharashtra</option>
          </Select>
        </div>

        <div>
          <Label>District</Label>
          <Select value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedState}>
            <option value="">Select District</option>
            {selectedState === "MH" && maharashtraData.districts.map(({ district }) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Sub-District/Taluka</Label>
          <Select value={selectedSubDistrict} onChange={handleSubDistrictChange} disabled={!selectedDistrict}>
            <option value="">Select Sub-District</option>
            {subDistricts.map(({ subDistrict }) => (
              <option key={subDistrict} value={subDistrict}>{subDistrict}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Village/Area</Label>
          <Select value={selectedVillage} onChange={(e) => setSelectedVillage(e.target.value)} disabled={!selectedSubDistrict}>
            <option value="">Select Village/Area</option>
            {villages.map((village) => (
              <option key={village} value={village}>{village}</option>
            ))}
          </Select>
        </div>

        <Button>Continue to Face Authentication</Button>
      </Container>
    </CenteredWrapper>
  );
};

export default VoterPage;
