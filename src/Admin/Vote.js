import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import maharashtraData from "../json/Maharashtra.json";

// Color palette (consistent with existing components)
const colors = {
  primary: "#3b82f6",
  primaryDark: "#2563eb",
  primaryLight: "#93c5fd",
  secondary: "#f3f4f6",
  success: "#10b981",
  successLight: "#d1fae5",
  danger: "#ef4444",
  dangerLight: "#fee2e2",
  warning: "#f59e0b",
  info: "#3b82f6",
  infoLight: "#dbeafe",
  dark: "#1f2937",
  light: "#f9fafb",
  white: "#ffffff",
  gray: "#6b7280",
  grayLight: "#e5e7eb"
};

const Container = styled.div`
  width: 800px;
  max-width: 100%;
  padding: 2rem;
  background: ${colors.white};
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  margin: 100px auto;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: ${colors.dark};
  position: relative;
  
  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: ${colors.primary};
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${colors.gray};
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 1.1rem;
  font-weight: 500;
  color: ${colors.dark};
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid ${colors.grayLight};
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  background-color: ${colors.white};
  color: ${colors.dark};

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    background-color: ${colors.secondary};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Button = styled.button`
  width: 100%;
  background: ${props => props.secondary ? colors.secondary : colors.primary};
  color: ${props => props.secondary ? colors.dark : colors.white};
  font-weight: 600;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  border: ${props => props.secondary ? `2px solid ${colors.grayLight}` : 'none'};
  cursor: pointer;
  font-size: 1.1rem;
  margin-top: ${props => props.mt || '1rem'};
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${props => props.secondary ? colors.grayLight : colors.primaryDark};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    background: ${colors.grayLight};
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
  }
`;

const MessageBase = styled.div`
  padding: 1rem;
  text-align: center;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  width: 100%;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ErrorMessage = styled(MessageBase)`
  color: ${colors.danger};
  background-color: ${colors.dangerLight};
  border-left: 4px solid ${colors.danger};
`;

const Vote = () => {
  const navigate = useNavigate();
  
  // Location state
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [subDistricts, setSubDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [error, setError] = useState("");

  // Location selection handlers
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

  // Validate form and navigate to candidates page
  const handleContinue = () => {
    if (!selectedState || !selectedDistrict || !selectedSubDistrict || !selectedVillage) {
      setError("Please select all location fields");
      return;
    }

    // Navigate to candidates page with location data
    navigate('/admin/vote-candidate', { 
      state: { 
        location: {
          state: selectedState,
          district: selectedDistrict,
          subDistrict: selectedSubDistrict,
          village: selectedVillage
        }
      }
    });
  };

  return (
    <Container>
      <Title>Cast Your Vote</Title>
      <Subtitle>Please select your location to view available candidates</Subtitle>
      
      <FormGroup>
        <Label>State</Label>
        <Select value={selectedState} onChange={handleStateChange} required>
          <option value="">Select State</option>
          <option value="MH">Maharashtra</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>District</Label>
        <Select 
          value={selectedDistrict} 
          onChange={handleDistrictChange} 
          disabled={!selectedState}
          required
        >
          <option value="">Select District</option>
          {selectedState === "MH" && maharashtraData.districts.map(({ district }) => (
            <option key={district} value={district}>{district}</option>
          ))}
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Sub-District/Taluka</Label>
        <Select 
          value={selectedSubDistrict} 
          onChange={handleSubDistrictChange} 
          disabled={!selectedDistrict}
          required
        >
          <option value="">Select Sub-District</option>
          {subDistricts.map(({ subDistrict }) => (
            <option key={subDistrict} value={subDistrict}>{subDistrict}</option>
          ))}
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Village/Area</Label>
        <Select 
          value={selectedVillage} 
          onChange={(e) => setSelectedVillage(e.target.value)} 
          disabled={!selectedSubDistrict}
          required
        >
          <option value="">Select Village/Area</option>
          {villages.map((village) => (
            <option key={village} value={village}>{village}</option>
          ))}
        </Select>
      </FormGroup>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Button onClick={handleContinue}>
        Continue to Candidates
      </Button>
    </Container>
  );
};

export default Vote;