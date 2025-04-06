import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getDatabase, ref, get } from "firebase/database";

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
  warningLight: "#fef3c7",
  infoLight: "#dbeafe",
  dark: "#1f2937",
  light: "#f9fafb",
  white: "#ffffff",
  gray: "#6b7280",
  grayLight: "#e5e7eb"
};

const Container = styled.div`
    // width: 900px;
    // max-width: 100%;
    // padding: 2rem;
    // background: ${colors.white};
    // border-radius: 1rem;
    // box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    // transition: all 0.3s ease;
    // margin: 0 auto;
    // min-height: 400px;
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

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const WinnerCard = styled.div`
  background-color: ${colors.successLight};
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  border-left: 6px solid ${colors.success};
  margin-bottom: 1.5rem;
  width: 800px;
  height: 280px;
`;

const WinnerLabel = styled.div`
  background-color: ${colors.success};
  color: white;
  font-weight: 600;
  padding: 0.4rem 1.5rem;
  border-radius: 2rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const WinnerPartyName = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${colors.dark};
`;

const VoteCount = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.success};
  margin-bottom: 1rem;
`;

const PartySymbol = styled.div`
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

const DistrictSectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1rem 3rem 0;
  
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${colors.grayLight};
`;

const DistrictResultsTable = styled.table`
  width: 90%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  margin: 1rem 5rem;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  background-color: ${colors.infoLight};
  color: ${colors.dark};
  font-weight: 600;
  &:first-child {
    border-top-left-radius: 0.5rem;
  }
  &:last-child {
    border-top-right-radius: 0.5rem;
    text-align: right;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${colors.light};
  }
  &:hover {
    background-color: ${colors.primaryLight}20;
  }
`;

const TableCell = styled.td`
  padding: 0.8rem 1rem;
  border-bottom: 1px solid ${colors.grayLight};
  &:last-child {
    text-align: right;
    font-weight: 600;
  }
`;

const Button = styled.button`
  background: ${props => props.secondary ? colors.secondary : colors.primary};
  color: ${props => props.secondary ? colors.dark : colors.white};
  font-weight: 600;
  padding: 0.8rem 1.5rem;
  border-radius: 0.5rem;
  border: ${props => props.secondary ? `2px solid ${colors.grayLight}` : 'none'};
  cursor: pointer;
  font-size: 1rem;
  margin-top: ${props => props.mt || '2rem'};
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;

  &:hover {
    background: ${props => props.secondary ? colors.grayLight : colors.primaryDark};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem; 
  margin-bottom: 1rem;
  margin-left : 40px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 0 5rem;
  max-height: 50px;
  margin-top: 32px;
  border-radius: 0.5rem;
  border: 2px solid ${colors.grayLight};
  background-color: ${colors.white};
  font-size: 1rem;
  color: ${colors.dark};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

const NoDataMessage = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: ${colors.infoLight};
  border-radius: 0.5rem;
  color: ${colors.dark};
  margin: 2rem 0;
`;

const ElectionResults = () => {
  const navigate = useNavigate();
  const database = getDatabase();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [partyResults, setPartyResults] = useState([]);
  const [districtResults, setDistrictResults] = useState({});
  const [candidateResults, setCandidateResults] = useState({});
  const [winningParty, setWinningParty] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [districts, setDistricts] = useState([]);
  const [dataExists, setDataExists] = useState(true);
  
  useEffect(() => {
    const fetchAllResults = async () => {
      try {
        setLoading(true);
        
        // Get reference to candidates node
        const candidatesRef = ref(database, "candidates");
        const candidatesSnapshot = await get(candidatesRef);
        
        if (!candidatesSnapshot.exists()) {
          setDataExists(false);
          setLoading(false);
          return;
        }
        
        // Check if Maharashtra exists in the database
        const maharashtraRef = ref(database, "candidates/Maharashtra");
        const maharashtraSnapshot = await get(maharashtraRef);
        
        if (!maharashtraSnapshot.exists()) {
          // If no Maharashtra node, try to find all votes across all states
          await processAllStates(candidatesSnapshot.val());
        } else {
          // Process just Maharashtra state
          await processMaharashtra(maharashtraSnapshot.val());
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to load election results. Please try again.");
        setLoading(false);
      }
    };
    
    // Process Maharashtra state data
    const processMaharashtra = async (maharashtraData) => {
      const allPartyVotes = {};
      const districtVotes = {};
      const districtCandidates = {};
      const districtNames = Object.keys(maharashtraData);
      
      setDistricts(districtNames);
      
      // Process each district
      for (const district of districtNames) {
        districtVotes[district] = {};
        districtCandidates[district] = [];
        
        // Process each subdistrict (if they exist)
        const subDistricts = maharashtraData[district] || {};
        for (const subDistrict of Object.keys(subDistricts)) {
          const villages = subDistricts[subDistrict] || {};
          
          // Process each village (if they exist)
          for (const village of Object.keys(villages)) {
            const candidates = villages[village] || {};
            
            // Process each candidate
            for (const candidateId of Object.keys(candidates)) {
              const candidate = candidates[candidateId];
              const party = candidate.party;
              const candidateName = candidate.name || "Unknown";
              const voteCount = candidate.voteCount || 0;
              
              // Add to district candidate list
              const existingCandidateIndex = districtCandidates[district].findIndex(
                c => c.candidateId === candidateId
              );
              
              if (existingCandidateIndex >= 0) {
                // Update existing candidate
                districtCandidates[district][existingCandidateIndex].voteCount += voteCount;
              } else if (voteCount > 0) {
                // Add new candidate
                districtCandidates[district].push({
                  candidateId,
                  name: candidateName,
                  party,
                  voteCount,
                  symbolName: candidate.symbolName || "",
                  symbolImageBase64: candidate.symbolImageBase64 || ""
                });
              }
              
              if (voteCount > 0) {
                // Update global party results
                if (!allPartyVotes[party]) {
                  allPartyVotes[party] = {
                    party,
                    voteCount: 0,
                    symbolName: candidate.symbolName || "",
                    symbolImageBase64: candidate.symbolImageBase64 || ""
                  };
                }
                allPartyVotes[party].voteCount += voteCount;
                
                // Update district results
                if (!districtVotes[district][party]) {
                  districtVotes[district][party] = {
                    party,
                    voteCount: 0
                  };
                }
                districtVotes[district][party].voteCount += voteCount;
              }
            }
          }
        }
        
        // Sort district candidates by vote count
        districtCandidates[district].sort((a, b) => b.voteCount - a.voteCount);
      }
      
      // Convert to array and sort
      const resultsArray = Object.values(allPartyVotes).sort((a, b) => b.voteCount - a.voteCount);
      
      if (resultsArray.length > 0) {
        setWinningParty(resultsArray[0]);
        setPartyResults(resultsArray);
        setDistrictResults(districtVotes);
        setCandidateResults(districtCandidates);
        setDataExists(true);
      } else {
        setDataExists(false);
      }
    };
    
    // Process all states if Maharashtra is not specifically defined
    const processAllStates = async (candidatesData) => {
      const allPartyVotes = {};
      const districtVotes = {};
      const districtCandidates = {};
      const allDistricts = [];
      
      // Process all states
      for (const state of Object.keys(candidatesData)) {
        const stateData = candidatesData[state];
        
        // Process each district
        for (const district of Object.keys(stateData)) {
          const districtKey = `${state}-${district}`;
          allDistricts.push(districtKey);
          districtVotes[districtKey] = {};
          districtCandidates[districtKey] = [];
          
          const subDistricts = stateData[district] || {};
          
          // Process each subdistrict
          for (const subDistrict of Object.keys(subDistricts)) {
            const villages = subDistricts[subDistrict] || {};
            
            // Process each village
            for (const village of Object.keys(villages)) {
              const candidates = villages[village] || {};
              
              // Process each candidate
              for (const candidateId of Object.keys(candidates)) {
                const candidate = candidates[candidateId];
                const party = candidate.party;
                const candidateName = candidate.name || "Unknown";
                const voteCount = candidate.voteCount || 0;
                
                // Add to district candidate list
                const existingCandidateIndex = districtCandidates[districtKey].findIndex(
                  c => c.candidateId === candidateId
                );
                
                if (existingCandidateIndex >= 0) {
                  // Update existing candidate
                  districtCandidates[districtKey][existingCandidateIndex].voteCount += voteCount;
                } else if (voteCount > 0) {
                  // Add new candidate
                  districtCandidates[districtKey].push({
                    candidateId,
                    name: candidateName,
                    party,
                    voteCount,
                    symbolName: candidate.symbolName || "",
                    symbolImageBase64: candidate.symbolImageBase64 || ""
                  });
                }
                
                if (voteCount > 0) {
                  // Update global party results
                  if (!allPartyVotes[party]) {
                    allPartyVotes[party] = {
                      party,
                      voteCount: 0,
                      symbolName: candidate.symbolName || "",
                      symbolImageBase64: candidate.symbolImageBase64 || ""
                    };
                  }
                  allPartyVotes[party].voteCount += voteCount;
                  
                  // Update district results
                  if (!districtVotes[districtKey][party]) {
                    districtVotes[districtKey][party] = {
                      party,
                      voteCount: 0
                    };
                  }
                  districtVotes[districtKey][party].voteCount += voteCount;
                }
              }
            }
          }
          
          // Sort district candidates by vote count
          districtCandidates[districtKey].sort((a, b) => b.voteCount - a.voteCount);
        }
      }
      
      // Convert to array and sort
      const resultsArray = Object.values(allPartyVotes).sort((a, b) => b.voteCount - a.voteCount);
      
      if (resultsArray.length > 0) {
        setWinningParty(resultsArray[0]);
        setPartyResults(resultsArray);
        setDistrictResults(districtVotes);
        setCandidateResults(districtCandidates);
        setDistricts(allDistricts);
        setDataExists(true);
      } else {
        setDataExists(false);
      }
    };
    
    fetchAllResults();
  }, [database]);
  
  // Handle district change
  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };
  
  // Navigate back to dashboard
  const handleBackToDashboard = () => {
    navigate('/admin-dashboard');
  };
  
  // Render table based on selected district
  const renderResultsTable = () => {
    if (selectedDistrict === "all") {
      // For "All Districts", show the party-wise results without candidate details
      return (
        <DistrictResultsTable>
          <thead>
            <tr>
              <TableHeader>Party</TableHeader>
              <TableHeader>Vote Count</TableHeader>
            </tr>
          </thead>
          <tbody>
            {partyResults.map((party) => (
              <TableRow key={party.party}>
                <TableCell>{party.party}</TableCell>
                <TableCell>{party.voteCount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {partyResults.length === 0 && (
              <TableRow>
                <TableCell colSpan="2" style={{ textAlign: 'center' }}>
                  No vote data available
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </DistrictResultsTable>
      );
    } else {
      // For specific district, show candidate-wise results
      const districtCandidateData = candidateResults[selectedDistrict] || [];
      
      return (
        <DistrictResultsTable>
          <thead>
            <tr>
              <TableHeader>Candidate Name</TableHeader>
              <TableHeader>Party</TableHeader>
              <TableHeader>Vote Count</TableHeader>
            </tr>
          </thead>
          <tbody>
            {districtCandidateData.map((candidate) => (
              <TableRow key={candidate.candidateId}>
                <TableCell>{candidate.name}</TableCell>
                <TableCell>{candidate.party}</TableCell>
                <TableCell>{candidate.voteCount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {districtCandidateData.length === 0 && (
              <TableRow>
                <TableCell colSpan="3" style={{ textAlign: 'center' }}>
                  No vote data available for this district
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </DistrictResultsTable>
      );
    }
  };
  
  return (
    <Container>
      <Title>Election Results</Title>
      <Subtitle>Vote counts for all political parties</Subtitle>
      
      {loading ? (
        <LoadingMessage>Loading election results...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : !dataExists ? (
        <NoDataMessage>
          <h3>No vote data available yet</h3>
          <p>Once voting begins, results will appear here.</p>
          <Button onClick={handleBackToDashboard} mt="1.5rem">
            Back to Dashboard
          </Button>
        </NoDataMessage>
      ) : (
        <ResultsContainer>
          {winningParty && (
            <WinnerCard>
              <WinnerLabel>Leading Party</WinnerLabel>
              {winningParty.symbolImageBase64 && (
                <PartySymbol>
                  <img 
                    src={winningParty.symbolImageBase64} 
                    alt={`${winningParty.symbolName} symbol`} 
                  />
                </PartySymbol>
              )}
              <WinnerPartyName>{winningParty.party}</WinnerPartyName>
              <VoteCount>{winningParty.voteCount.toLocaleString()} votes</VoteCount>
            </WinnerCard>
          )}
          
          <FilterContainer>
            <FilterSelect 
              value={selectedDistrict}
              onChange={handleDistrictChange}
            >
              <option value="all">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </FilterSelect>
            
            <Button secondary onClick={handleBackToDashboard}>
              Back to Dashboard
            </Button>
          </FilterContainer>
          
          <DistrictSectionTitle>
            {selectedDistrict === "all" ? "All Districts" : selectedDistrict} Results
          </DistrictSectionTitle>
          
          {renderResultsTable()}
        </ResultsContainer>
      )}
    </Container>
  );
};

export default ElectionResults;