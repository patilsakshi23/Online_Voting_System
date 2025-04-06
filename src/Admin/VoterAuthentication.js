import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import maharashtraData from "../json/Maharashtra.json";
import * as faceapi from "face-api.js";
import { database } from "../FirebaseConfig.js";
import { ref, get, child } from "firebase/database";

// Color palette
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
  align-items: center;
  min-height: 100vh;
  // background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 1rem;
`;

const Container = styled.div`
  width: 800px;
  max-width: 100%;
  padding: 2rem;
  margin: 2rem auto;
  background: ${colors.white};
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
    width: 100%;
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

  // &:disabled {
  //   background: ${colors.grayLight};
  //   cursor: not-allowed;
  //   opacity: 0.7;
  //   transform: none;
  // }
`;

const CameraContainer = styled.div`
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const VideoWrapper = styled.div`
  position: relative;
  max-width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid ${colors.grayLight};
  background-color: #000;
`;

const Video = styled.video`
  display: block;
  max-width: 100%;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
`;

const LoadingText = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: ${colors.gray};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.1rem;
`;

const Spinner = styled.div`
  border: 3px solid ${colors.grayLight};
  border-radius: 50%;
  border-top: 3px solid ${colors.primary};
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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

const StatusMessage = styled(MessageBase)`
  color: ${colors.info};
  background-color: ${colors.infoLight};
  border-left: 4px solid ${colors.info};
`;

const ProcessingMessage = styled(MessageBase)`
  color: ${colors.info};
  background-color: ${colors.infoLight};
  border-left: 4px solid ${colors.info};
`;

const SuccessMessage = styled(MessageBase)`
  color: ${colors.success};
  background-color: ${colors.successLight};
  border-left: 4px solid ${colors.success};
  flex-direction: column;
  padding: 1.5rem;
`;

const LocationInfo = styled.div`
  background-color: ${colors.secondary};
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  color: ${colors.dark};
  margin-bottom: 1.5rem;
  border-left: 4px solid ${colors.primary};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
`;

const VoterInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
  background: ${colors.secondary};
  padding: 1rem;
  border-radius: 0.5rem;
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: ${colors.dark};
  }
  
  p {
    margin: 0.2rem 0;
    font-size: 1.1rem;
  }
`;

const ProgressSteps = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 15px;
    left: 10%;
    right: 10%;
    height: 4px;
    background: ${colors.grayLight};
    z-index: 0;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  
  .step-number {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: ${props => props.active ? colors.primary : colors.grayLight};
    color: ${props => props.active ? colors.white : colors.gray};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
  }
  
  .step-label {
    font-size: 0.85rem;
    color: ${props => props.active ? colors.primary : colors.gray};
    text-align: center;
    font-weight: ${props => props.active ? 600 : 400};
  }
`;

const FaceAuthScreen = ({
  selectedState,
  selectedDistrict,
  selectedSubDistrict,
  selectedVillage,
  onAuthSuccess,
  onBack
}) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchedVoter, setMatchedVoter] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      setStatusMessage("Loading face recognition models...");
      try {
        const modelPath = 'https://justadudewhohacks.github.io/face-api.js/models';
        await Promise.all([
          faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
          faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
          faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath)
        ]);
        startVideo();
      } catch (error) {
        setErrorMessage("Failed to load face recognition models: " + error.message);
      }
    };
    
    loadModels();
    
    // Cleanup function
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
          setStatusMessage("");
          setTimeout(() => startFaceAuthentication(), 1000); // Start face auth after 1 second
        };
      }
    } catch (error) {
      setErrorMessage("Camera access denied or not available: " + error.message);
      setIsLoading(false);
    }
  };

  // Function to convert base64 to Image for face-api
  const base64ToImage = async (base64String) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
      img.src = base64String;
    });
  };

  // Load voters from Firebase based on selected location
  const loadVotersFromFirebase = async () => {
    // Build the path based on selected location
    const locationPath = `voters/${selectedState}/${selectedDistrict}/${selectedSubDistrict}/${selectedVillage}`;
    
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, locationPath));
      
      if (snapshot.exists()) {
        const votersData = snapshot.val();
        const votersList = [];
        
        // Convert the Firebase object to an array
        for (const voterId in votersData) {
          votersList.push({
            id: voterId,
            ...votersData[voterId]
          });
        }
        
        setStatusMessage(`Found ${votersList.length} registered voters in this area`);
        return votersList;
      } else {
        setStatusMessage("No voters found in selected location");
        return [];
      }
    } catch (error) {
      setErrorMessage("Failed to load voter database: " + error.message);
      return [];
    }
  };

  // Process face for recognition - convert base64 images from Firebase to face descriptors
  const processVoterFaces = async (voters) => {
    setStatusMessage("Processing voter database...");
    
    const labeledDescriptors = [];
    
    for (const voter of voters) {
      try {
        // Skip if voter has no face image
        if (!voter.faceImage) continue;
        
        // Convert base64 to image
        const img = await base64ToImage(voter.faceImage);
        
        // Detect face and get descriptor
        const detections = await faceapi.detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        
        if (detections) {
          // Create labeled face descriptor for this voter
          const labeledDescriptor = new faceapi.LabeledFaceDescriptors(
            voter.id, 
            [detections.descriptor]
          );
          
          labeledDescriptors.push({
            descriptor: labeledDescriptor,
            voterInfo: voter
          });
        }
      } catch (error) {
        console.error(`Error processing voter ${voter.id}:`, error);
      }
    }
    
    setStatusMessage(`Processed ${labeledDescriptors.length} voter faces`);
    return labeledDescriptors;
  };

  const startFaceAuthentication = async () => {
    if (!videoRef.current || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // 1. Load voter data from Firebase
      const voters = await loadVotersFromFirebase();
      
      if (voters.length === 0) {
        setErrorMessage("No registered voters found for the selected location");
        setIsProcessing(false);
        return;
      }
      
      // 2. Process voter face data (convert base64 to face descriptors)
      const processedVoters = await processVoterFaces(voters);
      
      if (processedVoters.length === 0) {
        setErrorMessage("No valid face data found for voters in this location");
        setIsProcessing(false);
        return;
      }
      
      // 3. Create face matcher from processed voters
      const labeledDescriptors = processedVoters.map(item => item.descriptor);
      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6); // 0.6 is the threshold
      
      // 4. Process face recognition in intervals
      const recognitionInterval = setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) {
          clearInterval(recognitionInterval);
          return;
        }
        
        // Detect faces in video stream
        const detections = await faceapi.detectAllFaces(videoRef.current)
          .withFaceLandmarks()
          .withFaceDescriptors();
          
        // Draw canvas for visualization
        const displaySize = { 
          width: videoRef.current.width, 
          height: videoRef.current.height 
        };
        
        faceapi.matchDimensions(canvasRef.current, displaySize);
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        // Clear previous drawings
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Check if any face detected
        if (detections.length > 0) {
          // Match each detected face against the database
          for (const detection of resizedDetections) {
            const match = faceMatcher.findBestMatch(detection.descriptor);
            
            // Draw face box and label
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { 
              label: match.toString(),
              boxColor: match.distance < 0.6 ? colors.success : colors.danger
            });
            drawBox.draw(canvasRef.current);
            
            // If match is found with high confidence
            if (match.distance < 0.6 && match.label !== 'unknown') {
              // Find the matched voter
              const matchedVoterId = match.label;
              const matchedVoterData = processedVoters.find(item => item.descriptor._label === matchedVoterId);
              
              if (matchedVoterData) {
                setMatchedVoter(matchedVoterData.voterInfo);
                setStatusMessage("Match found!");
                clearInterval(recognitionInterval);
                
                // Stop the camera
                if (videoRef.current && videoRef.current.srcObject) {
                  const tracks = videoRef.current.srcObject.getTracks();
                  tracks.forEach(track => track.stop());
                }
                
                break;
              }
            }
          }
        }
      }, 100); // Run every 100ms
      
      // Cleanup interval after 30 seconds if no match is found
      setTimeout(() => {
        clearInterval(recognitionInterval);
        if (!matchedVoter) {
          setErrorMessage("Authentication timeout. No matching voter found.");
          setIsProcessing(false);
        }
      }, 30000);
      
    } catch (error) {
      setErrorMessage("Face authentication error: " + error.message);
      setIsProcessing(false);
    }
  };
  
  const resetAuthentication = () => {
    // Clear any previous errors or matches
    setErrorMessage("");
    setStatusMessage("");
    setMatchedVoter(null);
    setIsProcessing(false);
    
    // Stop current video stream if it exists
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setIsLoading(true);
    // Restart the camera and face authentication
    startVideo();
  };

  return (
    <Container>
      <Title>Face Authentication</Title>
      <Subtitle>Please position your face at the center of the camera and remain still.</Subtitle>
      
      <CameraContainer> 
        <VideoWrapper>
          <Video 
            ref={videoRef} 
            autoPlay 
            muted
            width="640"
            height="480"
          />
          <Canvas 
            ref={canvasRef}
            width="640"
            height="480"
          />
        </VideoWrapper>
        
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        
        {isProcessing && !matchedVoter && !errorMessage && (
          <ProcessingMessage>
            <Spinner /> Please wait while we recognize your identity
          </ProcessingMessage>
        )}
        
        {matchedVoter && (
          <>
            <div>
              <Subtitle>You have been successfully authenticated and can now proceed to vote.</Subtitle>
              <VoterInfo>
                <p><strong>Voter ID:</strong> {matchedVoter.id}</p>
                <p><strong>Name:</strong> {matchedVoter.voterName}</p>
              </VoterInfo>
            </div>
            <Button onClick={resetAuthentication} disabled={isLoading}>
            Restart Verification
            </Button>
          {/* <Button onClick={() => onAuthSuccess(matchedVoter)}>
          Continue to Voting
        </Button> */}
        </>
        )}
      </CameraContainer>
      
    </Container>
  );
};

const VoterAuthentication = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [subDistricts, setSubDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [showFaceAuth, setShowFaceAuth] = useState(false);
  const [authenticatedVoter, setAuthenticatedVoter] = useState(null);

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

  const handleContinueToFaceAuth = () => {
    if (selectedState && selectedDistrict && selectedSubDistrict && selectedVillage) {
      setShowFaceAuth(true);
    }
  };

  const handleAuthSuccess = (voter) => {
    setAuthenticatedVoter(voter);

  };

  if (authenticatedVoter) {
    return (
      <CenteredWrapper>
        <Container>
          <Subtitle>You have been successfully authenticated and can now proceed to vote.</Subtitle>
          <VoterInfo>
            <p><strong>Voter ID:</strong> {authenticatedVoter.id}</p>
            <p><strong>Location:</strong> {selectedVillage}, {selectedSubDistrict}, {selectedDistrict}</p>
          </VoterInfo>
        </Container>
      </CenteredWrapper>
    );
  }

  if (showFaceAuth) {
    return (
      <CenteredWrapper>
        <FaceAuthScreen
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
          selectedSubDistrict={selectedSubDistrict}
          selectedVillage={selectedVillage}
          onAuthSuccess={handleAuthSuccess}
          onBack={() => {
            setShowFaceAuth(false);
          }}
        />
      </CenteredWrapper>
    );
  }

  return (
    <CenteredWrapper>
      <Container>
        <Title>Voter Authentication</Title>
        <Subtitle>Select your region to authenticate your voting credentials</Subtitle>
        <FormGroup>
          <Label>State</Label>
          <Select value={selectedState} onChange={handleStateChange}>
            <option value="">Select State</option>
            <option value="MH">Maharashtra</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>District</Label>
          <Select value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedState}>
            <option value="">Select District</option>
            {selectedState === "MH" && maharashtraData.districts.map(({ district }) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Sub-District/Taluka</Label>
          <Select value={selectedSubDistrict} onChange={handleSubDistrictChange} disabled={!selectedDistrict}>
            <option value="">Select Sub-District</option>
            {subDistricts.map(({ subDistrict }) => (
              <option key={subDistrict} value={subDistrict}>{subDistrict}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Village/Area</Label>
          <Select value={selectedVillage} onChange={(e) => setSelectedVillage(e.target.value)} disabled={!selectedSubDistrict}>
            <option value="">Select Village/Area</option>
            {villages.map((village) => (
              <option key={village} value={village}>{village}</option>
            ))}
          </Select>
        </FormGroup>

        <Button 
          onClick={handleContinueToFaceAuth}
          disabled={!selectedVillage}
        >
          Continue to Face Authentication
        </Button>
      </Container>
    </CenteredWrapper>
  );
};

export default VoterAuthentication;