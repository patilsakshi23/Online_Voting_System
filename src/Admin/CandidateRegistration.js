import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import maharashtraData from "../json/Maharashtra.json";
import { database } from "../FirebaseConfig.js";
import { ref as dbRef, set } from "firebase/database";

// Color palette (same as VoterAuthentication for consistency)
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

const CenteredWrapper = styled.div`
  display: flex;
  justify-content: center;
//   align-items: center;
  min-height: 100vh;
`;

const Container = styled.div`
  width: 800px;
  max-width: 100%;
  padding: 2rem;
  margin-top: 60px;
  background: ${colors.white};
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  max-height: 73vh; /* Set maximum height */
  overflow-y: auto; /* Enable vertical scrolling */
  overflow-x: hidden;

  /* Customize scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${colors.grayLight};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.primary};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${colors.primaryDark};
  }

  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: ${colors.primary} ${colors.grayLight};

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
    width: 100%;
    max-height: 100vh;
  }
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

const Input = styled.input`
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

const UploadPreview = styled.div`
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  
  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    border-radius: 0.5rem;
    border: 2px solid ${colors.grayLight};
    background: ${colors.secondary};
  }
  
  .no-image {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${colors.secondary};
    border-radius: 0.5rem;
    border: 2px dashed ${colors.gray};
    color: ${colors.gray};
    font-size: 0.8rem;
    text-align: center;
    padding: 0.5rem;
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

const SuccessMessage = styled(MessageBase)`
  color: ${colors.success};
  background-color: ${colors.successLight};
  border-left: 4px solid ${colors.success};
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: ${colors.white};
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transform: translateY(0);
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.success};
  margin-bottom: 1rem;
  text-align: center;
`;

const ModalMessage = styled.p`
  font-size: 1.1rem;
  color: ${colors.dark};
  text-align: center;
  margin-bottom: 0;
`;

const CandidateRegistration = () => {
  // Location state
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [subDistricts, setSubDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  
  // Candidate information state
  const [candidateName, setCandidateName] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [party, setParty] = useState("");
  const [symbolName, setSymbolName] = useState("");
  const [symbolImage, setSymbolImage] = useState(null);
  const [symbolImagePreview, setSymbolImagePreview] = useState(null);
  const [symbolImageBase64, setSymbolImageBase64] = useState(null);
  
  // Status messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  
  const symbolFileRef = useRef(null);
  
  // Location selection handlers (similar to VoterAuthentication)
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
  
  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  
  // Handle symbol image upload
  const handleSymbolImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.includes('image/')) {
        setError("Please upload an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      
      try {
        // Convert to base64
        const base64 = await convertToBase64(file);
        setSymbolImageBase64(base64);
        setSymbolImage(file);
        setSymbolImagePreview(URL.createObjectURL(file));
        setError("");
      } catch (error) {
        setError("Failed to process image: " + error.message);
      }
    }
  };
  
  // Reset form function
  const resetForm = () => {
    // Reset location fields
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedSubDistrict("");
    setSelectedVillage("");
    setSubDistricts([]);
    setVillages([]);
    
    // Reset candidate information
    setCandidateName("");
    setAadharNumber("");
    setPhoneNumber("");
    setParty("");
    setSymbolName("");
    setSymbolImage(null);
    setSymbolImagePreview(null);
    setSymbolImageBase64(null);
    
    // Reset file input
    if (symbolFileRef.current) {
      symbolFileRef.current.value = "";
    }
    
    // Reset status messages
    setError("");
    setSuccess("");
  };
  
  // Auto-close modal after 3 seconds
  useEffect(() => {
    let timer;
    if (showModal) {
      timer = setTimeout(() => {
        setShowModal(false);
      }, 2000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showModal]);
  
  // Validate form before submission
  const validateForm = () => {
    // Reset error message
    setError("");
    
    // Validate location fields
    if (!selectedState || !selectedDistrict || !selectedSubDistrict || !selectedVillage) {
      setError("Please select all location fields");
      return false;
    }
    
    // Validate candidate details
    if (!candidateName.trim()) {
      setError("Candidate name is required");
      return false;
    }
    
    // Validate Aadhar number (12 digits)
    if (!/^\d{12}$/.test(aadharNumber)) {
      setError("Aadhar number must be 12 digits");
      return false;
    }
    
    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Phone number must be 10 digits");
      return false;
    }
    
    // Validate party name
    if (!party.trim()) {
      setError("Party name is required");
      return false;
    }
    
    // Validate symbol name
    if (!symbolName.trim()) {
      setError("Symbol name is required");
      return false;
    }
    
    // Validate symbol image
    if (!symbolImageBase64) {
      setError("Symbol image is required");
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a unique ID for the candidate
      const candidateId = `C${Date.now()}`;
      
      // Build the path for Firebase
      const locationPath = `candidates/${selectedState}/${selectedDistrict}/${selectedSubDistrict}/${selectedVillage}`;
      
      // Create candidate object with the base64 string
      const candidateData = {
        id: candidateId,
        name: candidateName,
        aadharNumber,
        phoneNumber,
        party,
        symbolName,
        symbolImageBase64: symbolImageBase64, // Store only the base64 string
        location: {
          state: selectedState,
          district: selectedDistrict,
          subDistrict: selectedSubDistrict,
          village: selectedVillage
        },
        timestamp: new Date().toISOString()
      };
      
      // Save to Firebase Realtime Database
      await set(dbRef(database, `${locationPath}/${candidateId}`), candidateData);
      
      // Show success message
      setSuccess("Candidate registered successfully!");
      
      // Show modal
      setShowModal(true);
      
      // Reset form
      resetForm();
      
    } catch (error) {
      setError(`Registration failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <CenteredWrapper>
      <Container>
        <Title>Candidate Registration</Title>
        <Subtitle>Register a new election candidate for your constituency</Subtitle>
        
        <form onSubmit={handleSubmit}>
          {/* Location Selection */}
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
          
          {/* Candidate Information */}
          <FormGroup>
            <Label>Candidate Name</Label>
            <Input 
              type="text" 
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Enter full name"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Aadhar Number</Label>
            <Input 
              type="text" 
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
              placeholder="12-digit Aadhar number"
              maxLength={12}
              pattern="\d{12}"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Phone Number</Label>
            <Input 
              type="tel" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit phone number"
              maxLength={10}
              pattern="\d{10}"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Political Party</Label>
            <Select 
                type="select" 
                value={party}
                onChange={(e) => setParty(e.target.value)}
                required
            >
                <option value="">Select a party</option>
                <option value="Bharatiya Janata Party">Bharatiya Janata Party - [BJP]</option>
                <option value="Indian National Congress">Indian National Congress - [INC]</option>
                <option value="Aam Aadmi Party">Aam Aadmi Party - [AAP]</option>
                <option value="Bahujan Samaj Party">Bahujan Samaj Party - [BSP]</option>
                <option value="Communist Party of India(Marxist)">Communist Party of India(Marxist) - [CPM]</option>

                {/* Add more party options as needed */}
            </Select>
            </FormGroup>
          
          <FormGroup>
            <Label>Symbol Name</Label>
            <Input 
              type="text" 
              value={symbolName}
              onChange={(e) => setSymbolName(e.target.value)}
              placeholder="Enter election symbol name"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Symbol Image</Label>
            <Input 
              type="file"
              ref={symbolFileRef} 
              accept="image/*"
              onChange={handleSymbolImageChange}
              required
            />
            <UploadPreview>
              {symbolImagePreview ? (
                <img src={symbolImagePreview} alt="Symbol preview" />
              ) : (
                <div className="no-image">No image selected</div>
              )}
            </UploadPreview>
          </FormGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register Candidate"}
          </Button>
        </form>
      </Container>
      
      {/* Success Modal */}
      {showModal && (
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>Registration Successful</ModalTitle>
            <ModalMessage>Your registration has been submitted successfully.</ModalMessage>
          </ModalContainer>
        </ModalOverlay>
      )}
    </CenteredWrapper>
  );
};

export default CandidateRegistration;