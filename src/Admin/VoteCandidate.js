import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getDatabase, ref, get, update, increment } from "firebase/database";

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
  infoLight: "#dbeafe",
  dark: "#1f2937",
  light: "#f9fafb",
  white: "#ffffff",
  gray: "#6b7280",
  grayLight: "#e5e7eb"
};

const Container = styled.div`
  width: 900px;
  max-width: 100%;
  padding: 2rem;
  background: ${colors.white};
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  margin: 0 auto;
  min-height: 400px;
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

const LocationInfo = styled.div`
  background-color: ${colors.infoLight};
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  text-align: center;
  
  span {
    font-weight: 600;
  }
`;

const CandidatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const CandidateCard = styled.div`
  border: 2px solid ${colors.grayLight};
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  ${props => props.selected && `
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    
    &:after {
      content: "✓";
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: ${colors.primary};
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
  `}
`;

const CandidateSymbol = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem;
  border-radius: 0.5rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const CandidateName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const PartyName = styled.div`
  font-size: 1rem;
  color: ${colors.gray};
  text-align: center;
  margin-bottom: 1rem;
`;

const SymbolName = styled.div`
  font-size: 0.9rem;
  color: ${colors.dark};
  text-align: center;
  padding: 0.3rem 0.8rem;
  background-color: ${colors.grayLight};
  border-radius: 1rem;
  display: inline-block;
  margin: 0 auto;
  width: fit-content;
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
  margin-top: ${props => props.mt || '2rem'};
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

const BackButton = styled(Button)`
  width: auto;
  margin-right: auto;
  margin-bottom: 2rem;
  padding: 0.5rem 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: ${colors.gray};
  margin: 3rem 0;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  text-align: center;
  border-radius: 0.5rem;
  margin: 2rem 0;
  width: 100%;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  color: ${colors.danger};
  background-color: ${colors.dangerLight};
  border-left: 4px solid ${colors.danger};
`;

const NoCandidatesMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: ${colors.grayLight};
  border-radius: 0.5rem;
  margin: 2rem 0;
  color: ${colors.dark};
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
  max-width: 500px;
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
  font-size: 1.8rem;
  font-weight: 700;
  color: ${colors.success};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ModalMessage = styled.p`
  font-size: 1.2rem;
  color: ${colors.dark};
  text-align: center;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  button {
    flex: 1;
  }
`;

const VoteCandidate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const database = getDatabase();
  
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [voteInProgress, setVoteInProgress] = useState(false);
  
  // Get location data from navigation state
  const locationData = location.state?.location;
  
  // Redirect if no location data is present
  useEffect(() => {
    if (!locationData) {
      navigate('/admin/vote');
    }
  }, [locationData, navigate]);
  
  useEffect(() => {
    let timer;
    if (showSuccessModal) {
      timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccessModal]);

  // Fetch candidates from Firebase based on location
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!locationData) return;
      
      try {
        setLoading(true);
        const { state, district, subDistrict, village } = locationData;
        const candidatesRef = ref(database, `candidates/${state}/${district}/${subDistrict}/${village}`);
        
        const snapshot = await get(candidatesRef);
        
        if (snapshot.exists()) {
          const candidatesData = snapshot.val();
          const candidatesArray = Object.values(candidatesData);
          setCandidates(candidatesArray);
        } else {
          setCandidates([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setError("Failed to load candidates. Please try again.");
        setLoading(false);
      }
    };
    
    fetchCandidates();
  }, [database, locationData]);
  
  // Handle candidate selection
  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
  };
  
  // Handle vote confirmation
  const handleConfirmVote = async () => {
    if (!selectedCandidate || voteInProgress) return;
    
    try {
      setVoteInProgress(true);
      
      // Get location path components
      const { state, district, subDistrict, village } = locationData;
      
      // Create a reference to the specific candidate to update vote count
      const candidateRef = ref(
        database, 
        `candidates/${state}/${district}/${subDistrict}/${village}/${selectedCandidate.id}`
      );
      
      // Get current candidate data
      const candidateSnapshot = await get(candidateRef);
      
      if (candidateSnapshot.exists()) {
        // Update the vote count directly in the candidate object
        await update(candidateRef, {
          voteCount: increment(1),
          lastVoteTimestamp: Date.now()
        });
        
        setShowSuccessModal(true);
        setSelectedCandidate(null); // Clear the selected candidate after successful vote
      } else {
        throw new Error("Candidate no longer exists");
      }
      
    } catch (err) {
      console.error("Error recording vote:", err);
      setError("Failed to record your vote. Please try again.");
    } finally {
      setVoteInProgress(false);
    }
  };
  
  // Handle return to dashboard after successful vote
  const handleReturnToDashboard = () => {
    navigate('/admin/dashboard');
  };
  
  // Format location for display
  const formatLocation = () => {
    if (!locationData) return "";
    
    const { village, subDistrict, district, state } = locationData;
    return `${village}, ${subDistrict}, ${district}, ${state}`;
  };
  
  // Check if we have location data for rendering
  if (!locationData && !loading) {
    return null; // This will be handled by the redirect in useEffect
  }
  
  return (
    <Container>
      
      <Title>Select Your Candidate</Title>
      <Subtitle>Please review all candidates and select one to cast your vote</Subtitle>
      
      <LocationInfo>
        Voting for location: <span>{formatLocation()}</span>
      </LocationInfo>
      
      {loading ? (
        <LoadingMessage>Loading candidates...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : candidates.length === 0 ? (
        <NoCandidatesMessage>
          No candidates found for this location. Please check with your election administrator.
        </NoCandidatesMessage>
      ) : (
        <>
          <CandidatesGrid>
            {candidates.map((candidate) => (
              <CandidateCard 
                key={candidate.id}
                selected={selectedCandidate?.id === candidate.id}
                onClick={() => handleCandidateSelect(candidate)}
              >
                <CandidateSymbol>
                  <img 
                    src={candidate.symbolImageBase64} 
                    alt={`${candidate.symbolName} symbol`} 
                  />
                </CandidateSymbol>
                <CandidateName>{candidate.name}</CandidateName>
                <PartyName>{candidate.party}</PartyName>
                <SymbolName>{candidate.symbolName}</SymbolName>
              </CandidateCard>
            ))}
          </CandidatesGrid>
          
          <Button 
            onClick={handleConfirmVote}
            disabled={!selectedCandidate || voteInProgress}
            mt="2rem"
          >
            {voteInProgress ? "Processing..." : "Cast Vote"}
          </Button>
        </>
      )}
      
      {/* Success Modal */}
      {showSuccessModal && (
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>Vote Cast Successfully!</ModalTitle>
            <ModalMessage>
              Thank you for casting your vote. Your participation in the democratic process is important.
            </ModalMessage>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default VoteCandidate;