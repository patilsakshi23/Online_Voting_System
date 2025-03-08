import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Tesseract from 'tesseract.js';
import maharashtraData from "../assets/Maharashtra.json";

// In your Registration.js file
import { database } from "../FirebaseConfig.js";
import { ref, set } from "firebase/database";

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 20px;
`;

const ProgressIndicator = styled.div`
  margin-bottom: 40px;
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const Progress = styled.div`
  height: 100%;
  background-color: #3498db;
  transition: width 0.3s ease;
  width: ${props => (props.step / 4) * 100}%;
`;

const StepIndicators = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StepDot = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => (props.active ? '#3498db' : '#ecf0f1')};
  color: ${props => (props.active ? 'white' : '#7f8c8d')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: relative;
`;

const Form = styled.form`
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const UploadArea = styled.div`
  border: 2px dashed #bdc3c7;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  margin-bottom: 20px;
  cursor: pointer;
  transition: border-color 0.3s;

  &:hover {
    border-color: #3498db;
  }
`;

const UploadPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UploadIcon = styled.i`
  font-size: 48px;
  margin-bottom: 10px;
  color: #7f8c8d;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  color: #7f8c8d;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #ecf0f1;
  }

  span {
    padding: 0 10px;
  }
`;

const ScanButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #27ae60;
  }
`;

const FormFields = styled.div`
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

// const TextArea = styled.textarea`
//   width: 100%;
//   padding: 12px;
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   font-size: 16px;
//   transition: border-color 0.3s;
//   min-height: 100px;
//   resize: vertical;

//   &:focus {
//     border-color: #3498db;
//     outline: none;
//   }
// `;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const ProcessingIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 10px;
`;

const OcrMessage = styled.div`
  background-color: #e8f7f0;
  border-left: 4px solid #2ecc71;
  padding: 10px 15px;
  margin-top: 20px;
  border-radius: 4px;
`;

const CameraContainer = styled.div`
  margin-bottom: 20px;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 400px;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
`;

const CameraFeed = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CameraInstructions = styled.div`
  text-align: center;
  margin-bottom: 15px;
`;

const CaptureButton = styled.button`
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c0392b;
  }
`;

const CapturedImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CapturedFace = styled.img`
  max-width: 100%;
  height: 300px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const RetakeButton = styled.button`
  padding: 10px 20px;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #7f8c8d;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const BackButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #ecf0f1;
  color: #7f8c8d;

  &:hover {
    background-color: #bdc3c7;
  }
`;

const NextButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #3498db;
  color: white;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #2ecc71;
  color: white;

  &:hover {
    background-color: #27ae60;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CapturedImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: contain;
  border-radius: 8px;
`;
const StepContainer = styled.div``;

const Registration = () => {
  // State management
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    voterCardFile: null,
    voterCardPreview: null,
    name: '',
    fatherName: '',
    voterNumber: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    faceImage: null,
    state: '',
    district: '',
    subDistrict: '',
    village: '',
    streetAddress: '',
    zipCode: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOCRComplete, setIsOCRComplete] = useState(false);
  const [extractionError, setExtractionError] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrText, setOcrText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    console.log("Step changed to:", step);
  }, [step]);

  const openCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      setCapturedImage(imageData);
      setFormData(prevData => ({
        ...prevData,
        voterCardFile: imageData, // Store captured image
        voterCardPreview: imageData // Also update preview if needed
      }));
      stopCamera();
    }
  };

  // Improved function to extract information from OCR text using regex patterns
  const extractVoterInfo = (text) => {
    console.log("Raw OCR text:", text);
    
    // Initialize extracted data object
    const extractedData = {
      name: '',
      fatherName: '',
      voterNumber: '',
      address: '',
      dateOfBirth: '',
      gender: ''
    };

    // Store the raw OCR text for debugging
    setOcrText(text);
    
    // Improved regex patterns for better extraction
    
    // Name pattern - more flexible to catch various formats
    const namePatterns = [
      /Name\s*[:|\s]\s*([A-Za-z\s.]+)/i,
      /(?:Voter's Name|Elector's Name)[:|\s]\s*([A-Za-z\s.]+)/i,
      /Name of Elector\s*[:|\s]\s*([A-Za-z\s.]+)/i
    ];
    
    for (const pattern of namePatterns) {
      const nameMatch = text.match(pattern);
      if (nameMatch && nameMatch[1] && nameMatch[1].trim().length > 0) {
        extractedData.name = nameMatch[1].trim();
        break;
      }
    }
    
    // Father's name pattern - more flexible
    const fatherPatterns = [
      /Father(?:'s)?\s*(?:Name)?\s*[:|\s]\s*([A-Za-z\s.]+)/i,
      /(?:F|Father|Father's)\s*(?:Name)?\s*[:|\s]\s*([A-Za-z\s.]+)/i,
      /Husband(?:'s)?\s*(?:Name)?\s*[:|\s]\s*([A-Za-z\s.]+)/i
    ];
    
    for (const pattern of fatherPatterns) {
      const fatherMatch = text.match(pattern);
      if (fatherMatch && fatherMatch[1] && fatherMatch[1].trim().length > 0) {
        extractedData.fatherName = fatherMatch[1].trim();
        break;
      }
    }
    
    // Voter ID pattern (various formats)
    const voterIDPatterns = [
      /(?:Voter\s+(?:ID|Number)|Electoral\s+Roll\s+No|EPIC\s+No|Card\s+No)[.:|\s]*\s*([A-Z0-9]{6,12})/i,
      /([A-Z]{3}[0-9]{7})/,  // Common format like ABC1234567
      /(?:ID Number|ID No|Card No)[.:|\s]*\s*([A-Z0-9]{6,12})/i
    ];
    
    for (const pattern of voterIDPatterns) {
      const voterIDMatch = text.match(pattern);
      if (voterIDMatch && voterIDMatch[1] && voterIDMatch[1].trim().length > 0) {
        extractedData.voterNumber = voterIDMatch[1].trim();
        break;
      }
    }
    
    // Date of Birth pattern - various formats
    const dobPatterns = [
      /(?:DOB|Date\s+of\s+Birth)[.:|\s]*\s*(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})/i,
      /(?:Born\s+on|Birth\s+Date)[.:|\s]*\s*(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})/i,
      /(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})/  // Just look for date format
    ];
    
    for (const pattern of dobPatterns) {
      const dobMatch = text.match(pattern);
      if (dobMatch && dobMatch[1]) {
        // Convert to YYYY-MM-DD format for the input field
        const dobParts = dobMatch[1].split(/[-/.]/);
        if (dobParts.length === 3) {
          // Assuming DD-MM-YYYY format in voter card
          let year = dobParts[2];
          const month = dobParts[1].padStart(2, '0');
          const day = dobParts[0].padStart(2, '0');
          
          // Handle 2-digit years
          if (year.length === 2) {
            const currentYear = new Date().getFullYear().toString();
            const century = currentYear.substring(0, 2);
            year = parseInt(year) > 50 ? `19${year}` : `${century}${year}`;
          }
          
          extractedData.dateOfBirth = `${year}-${month}-${day}`;
          break;
        }
      }
    }
    
    // Gender pattern
    const genderPatterns = [
      /(?:Gender|Sex)[.:|\s]*\s*(Male|Female|Other)/i,
      /(?:Gender|Sex)[.:|\s]*\s*([MF])/i  // Look for M or F abbreviations
    ];
    
    for (const pattern of genderPatterns) {
      const genderMatch = text.match(pattern);
      if (genderMatch && genderMatch[1]) {
        // Handle M/F abbreviations
        let gender = genderMatch[1];
        if (gender.toLowerCase() === 'm') {
          gender = 'Male';
        } else if (gender.toLowerCase() === 'f') {
          gender = 'Female';
        } else {
          // Capitalize first letter only
          gender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
        }
        extractedData.gender = gender;
        break;
      }
    }
    
    // Address pattern - improved to capture more address formats
    const addressPatterns = [
      /Address[.:|\s]*\s*([^]*?)(?=(?:Date|Gender|Sex|DOB|Voter|Electoral|$))/i,
      /(?:Resident|House)[.:|\s]*\s*([^]*?)(?=(?:Date|Gender|Sex|DOB|Voter|Electoral|$))/i
    ];
    
    for (const pattern of addressPatterns) {
      const addressMatch = text.match(pattern);
      if (addressMatch && addressMatch[1] && addressMatch[1].trim().length > 0) {
        extractedData.address = addressMatch[1].trim()
          .replace(/\n+/g, ', ')  // Replace newlines with commas
          .replace(/\s+/g, ' ')   // Normalize spaces
          .replace(/,\s*,/g, ',') // Remove duplicate commas
          .trim();
        break;
      }
    }
    
    // Determine if extraction was successful - at least some fields should be extracted
    const hasExtractedData = Object.values(extractedData).some(value => value !== '');
    
    if (!hasExtractedData) {
      throw new Error("No voter information could be extracted from the image");
    }
    
    console.log("Extracted data:", extractedData);
    return extractedData;
  };

  // Improved OCR function with better image preprocessing
  const performOCR = async (imageFile) => {
    try {
      setOcrProgress(0);
      
      // Create image URL for processing
      const imageUrl = URL.createObjectURL(imageFile);
      
      // Perform OCR with Tesseract with improved settings
      const result = await Tesseract.recognize(
        imageUrl,
        'eng', // Language - English
        {
          logger: message => {
            // Update progress based on Tesseract status
            if (message.status === 'recognizing text') {
              setOcrProgress(message.progress * 100);
            }
          },
          // Improve OCR accuracy with these settings
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/-.,:;() ',
          tessjs_create_pdf: '0',
          tessjs_create_hocr: '0',
          tessjs_create_tsv: '0',
          tessjs_create_box: '0'
        }
      );
      
      // Cleanup
      URL.revokeObjectURL(imageUrl);
      
      // Extract voter information from OCR text
      const extractedData = extractVoterInfo(result.data.text);
      
      return extractedData;
    } catch (error) {
      console.error("OCR Error:", error);
      throw error;
    }
  };

  // Handle file upload for voter card
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Reset extraction error state
      setExtractionError(false);
      setOcrText('');
      
      // Read file and show preview
      const reader = new FileReader();
      reader.onload = async (e) => {
        setFormData(prevData => ({
          ...prevData,
          voterCardFile: file,
          voterCardPreview: e.target.result
        }));
        
        // Start OCR processing
        setIsProcessing(true);
        
        try {
          // Process the voter card with OCR
          const extractedData = await performOCR(file);
          
          // Update form with extracted data
          setFormData(prevData => ({
            ...prevData,
            ...extractedData
          }));
          
          setIsOCRComplete(true);
        } catch (error) {
          console.error("OCR Processing Error:", error);
          setExtractionError(true);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Update the nextStep function to ensure camera starts when moving to Step 4
  const nextStep = () => {
    if (validateStep()) {
      const nextStepValue = step + 1;
      setStep(nextStepValue);
      
      // Start the camera when moving to Step 4
      if (nextStepValue === 4) {
        // Wait for component to update before starting camera
        setTimeout(() => {
          startCamera();
        }, 100);
      }
    }
  };
  
  // Navigate to previous step
  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
    if (step === 4) {
      stopCamera();
    }
  };
  
  // Validate current step
  const validateStep = () => {
    let stepErrors = {};
    let isValid = true;
    
    console.log("Validating step:", step);
    
    if (step === 1) {
      if (!formData.voterCardFile) {
        stepErrors.voterCard = "Please upload your voter card";
        isValid = false;
      }
    } else if (step === 2) {
      if (!formData.name) {
        stepErrors.name = "Name is required";
        isValid = false;
      }
      if (!formData.voterNumber) {
        stepErrors.voterNumber = "Voter ID number is required";
        isValid = false;
      }
      if (!formData.gender) {
        stepErrors.gender = "Gender is required";
        isValid = false;
      }
      if (!formData.dateOfBirth) {
        stepErrors.dateOfBirth = "Date of birth is required";
        isValid = false;
      }
    } else if (step === 3) {
      if (!formData.state) {
        stepErrors.state = "State is required";
        isValid = false;
      }
      if (!formData.district) {
        stepErrors.district = "District is required";
        isValid = false;
      }
      if (!formData.subDistrict) {
        stepErrors.subDistrict = "Sub-District is required";
        isValid = false;
      }
      if (!formData.village) {
        stepErrors.village = "Village/Area is required";
        isValid = false;
      }
      if (!formData.streetAddress) {
        stepErrors.streetAddress = "Street address is required";
        isValid = false;
      }
      if (!formData.zipCode) {
        stepErrors.zipCode = "Zip/Postal code is required";
        isValid = false;
      }
    }
    
    console.log("Validation result:", isValid, stepErrors);
    setErrors(stepErrors);
    return isValid;
  };

  // Improve the startCamera function for better reliability
  const startCamera = async () => {
    try {
      // Clear any previous errors
      setErrors(prev => ({ ...prev, camera: null }));
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      } else {
        console.error("Video reference is not available");
        setErrors(prev => ({ ...prev, camera: "Camera initialization failed: video element not found" }));
        // Don't reset the step here, just show an error
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setErrors(prev => ({ 
        ...prev, 
        camera: `Unable to access camera: ${err.message || 'Please ensure camera permissions are granted'}` 
      }));
      // Don't reset the step here, just show an error
    }
  };
  
  // Improved stopCamera function for better cleanup
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };    
  
  // Improved captureImage function for better reliability
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) {
      setErrors(prev => ({ ...prev, camera: "Camera reference not available" }));
      return;
    }
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Make sure video dimensions are available
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setErrors(prev => ({ ...prev, camera: "Video stream not ready yet. Please wait a moment." }));
      return;
    }
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the video frame on the canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    try {
      // Convert to data URL
      const imageDataURL = canvas.toDataURL('image/png');
      
      // Update state with captured image
      setFormData(prev => ({
        ...prev,
        faceImage: imageDataURL
      }));
      
      // Stop camera after capturing
      stopCamera();
    } catch (error) {
      console.error("Image capture error:", error);
      setErrors(prev => ({ ...prev, camera: `Failed to capture image: ${error.message}` }));
    }
  };

  // Handle form submission with only database (no storage)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      try {
        // Set submitting state to show loading indicator
        setIsSubmitting(true);
        
        // Validate that required fields are present
        if (!formData.voterNumber || !formData.state || !formData.district || 
            !formData.subDistrict || !formData.village) {
          throw new Error("Missing required fields");
        }
        
        // Create the path according to the specified structure
        const voterPath = `voters/${formData.state}/${formData.district}/${formData.subDistrict}/${formData.village}/${formData.voterNumber}`;
        
        // Create the data object to save - without image URL
        const voterData = {
          voterName: formData.name,
          fatherName: formData.fatherName,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          address: {
            street: formData.streetAddress,
            zipCode: formData.zipCode,
          },
          faceImage: formData.faceImage,
          timestamp: new Date().toISOString()
        };
        
        // Save to Firebase Realtime Database
        await set(ref(database, voterPath), voterData);
        
        // Show success message and loading state
        setIsSubmitting(false);
        setShowModal(true);
        
      } catch (error) {
        console.error("Submission error:", error);
        alert(`Error submitting registration: ${error.message}`);
        setIsSubmitting(false);
      }
    }
  };
  
  // Manual retrying of OCR
  const retryOCR = async () => {
    if (formData.voterCardFile) {
      setExtractionError(false);
      setIsProcessing(true);
      
      try {
        const extractedData = await performOCR(formData.voterCardFile);
        setFormData(prevData => ({
          ...prevData,
          ...extractedData
        }));
        setIsOCRComplete(true);
      } catch (error) {
        console.error("OCR Retry Error:", error);
        setExtractionError(true);
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  // State management for location selections
  const [subDistricts, setSubDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  // Handle district selection and load sub-districts
  const handleDistrictChange = (e) => {
    const district = e.target.value;
    const updatedFormData = {
      ...formData,
      district: district,
      subDistrict: "",
      village: ""
    };
    setFormData(updatedFormData);
    
    // Find the selected district data
    const districtData = maharashtraData.districts.find(d => d.district === district);
    setSubDistricts(districtData ? districtData.subDistricts : []);
    setVillages([]);
  };

  // Handle sub-district selection and load villages
  const handleSubDistrictChange = (e) => {
    const subDistrict = e.target.value;
    const updatedFormData = {
      ...formData,
      subDistrict: subDistrict,
      village: ""
    };
    setFormData(updatedFormData);
    
    // Find the selected sub-district data
    const subDistrictData = subDistricts.find(sd => sd.subDistrict === subDistrict);
    setVillages(subDistrictData ? subDistrictData.villages : []);
  };

  // Debug mode toggle
  const [debugMode] = useState(false);
  
  // Render step content
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepContainer className="upload-step">
            <h2>Step 1: Upload or Scan Voter Card</h2>
            <div>
            {!isCameraOpen && !capturedImage && (
              <>
            <UploadArea onClick={() => fileInputRef.current.click()}>
              {formData.voterCardPreview ? (
                <PreviewImage src={formData.voterCardPreview} alt="Voter Card Preview" />
              ) : (
                <UploadPlaceholder>
                  <UploadIcon>📄</UploadIcon>
                  <p>Click to upload or drag your voter card here</p>
                  <p style={{ fontSize: '14px', color: '#666' }}>For best results, ensure the image is clear and well-lit</p>
                </UploadPlaceholder>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </UploadArea>
            {errors.voterCard && <ErrorMessage>{errors.voterCard}</ErrorMessage>}
            
            <OrDivider>
              <span>OR</span>
            </OrDivider>

            <ScanButton onClick={openCamera}>Scan with Camera</ScanButton>
            </>
            )}

      {isCameraOpen && (
        <div>
          <VideoContainer>
            <CameraFeed ref={videoRef} autoPlay />
          </VideoContainer>
          <CaptureButton onClick={capturePhoto}>Capture Photo</CaptureButton>
        </div>
      )}

      {capturedImage && <CapturedImage src={capturedImage} alt="Captured" />}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
          
            
            <NavigationButtons>
              <div></div> {/* Empty div for spacing */}
              <NextButton onClick={nextStep} disabled={(!formData.voterCardFile && !capturedImage) || isProcessing}>
                {isProcessing ? 'Processing...' : 'Next'}
              </NextButton>
            </NavigationButtons>
          </StepContainer>
        );
        
      case 2:
        return (
          <StepContainer className="details-step">
            <h2>Step 2: Personal Information</h2>
            {isProcessing ? (
              <ProcessingIndicator>
                <Spinner />
                <p>Processing voter card data... {ocrProgress.toFixed(0)}%</p>
              </ProcessingIndicator>
            ) : (
              <FormFields>
                {extractionError && (
                  <ErrorMessage style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee' }}>
                    <p>We couldn't automatically extract information from your voter card. Please ensure the image is clear and well-lit, or enter the details manually.</p>
                    <button 
                      onClick={retryOCR}
                      style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#f44336', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        marginTop: '8px'
                      }}
                    >
                      Retry Extraction
                    </button>
                  </ErrorMessage>
                )}
                
                {/* Display a card with the extracted information */}
                {isOCRComplete && !extractionError && (
                  <OcrMessage>
                   <p>We've extracted information from your voter card. Please verify the details above and make corrections if needed.</p>
                  </OcrMessage>     
                )}
                <FormGroup>
                  <Label htmlFor="voterNumber">Voter ID Number</Label>
                  <Input 
                    type="text" 
                    id="voterNumber" 
                    name="voterNumber" 
                    value={formData.voterNumber} 
                    onChange={handleInputChange} 
                    placeholder="Enter your voter ID number"
                  />
                  {errors.voterNumber && <ErrorMessage>{errors.voterNumber}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="name">Full Name (as on Voter Card)</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter your full name"
                  />
                  {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="fatherName">Father's Name</Label>
                  <Input 
                    type="text" 
                    id="fatherName" 
                    name="fatherName" 
                    value={formData.fatherName} 
                    onChange={handleInputChange} 
                    placeholder="Enter your father's name"
                  />
                  {errors.fatherName && <ErrorMessage>{errors.fatherName}</ErrorMessage>}
                </FormGroup>
                
                {/* Gender and DOB fields moved to Step 2 */}
                <FormGroup>
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    id="gender" 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleInputChange} 
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Select>
                  {errors.gender && <ErrorMessage>{errors.gender}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input 
                    type="date" 
                    id="dateOfBirth" 
                    name="dateOfBirth" 
                    value={formData.dateOfBirth} 
                    onChange={handleInputChange} 
                  />
                  {errors.dateOfBirth && <ErrorMessage>{errors.dateOfBirth}</ErrorMessage>}
                </FormGroup>
                
                {/* Debug information - only shown in debug mode */}
                {debugMode && ocrText && (
                  <div style={{ 
                    marginTop: '20px', 
                    padding: '10px', 
                    backgroundColor: '#f8f9fa', 
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    <h4 style={{ marginTop: 0 }}>Raw OCR Text:</h4>
                    <pre>{ocrText}</pre>
                  </div>
                )}
              </FormFields>
            )}
            
            <NavigationButtons>
              <BackButton onClick={prevStep}>
                Back
              </BackButton>
              <NextButton onClick={nextStep} disabled={isProcessing}>
                Next
              </NextButton>
            </NavigationButtons>
          </StepContainer>
        );
          
        case 3:
          return (
            <StepContainer className="address-step">
              <h2>Step 3: Address Information</h2>
              <FormFields>
                <FormGroup>
                  <Label htmlFor="state">State</Label>
                  <Select
                    id="state"
                    name="state"
                    value={formData.state || ''}
                    onChange={(e) => {
                      const updatedFormData = {
                        ...formData,
                        state: e.target.value,
                        district: "",
                        subDistrict: "",
                        village: ""
                      };
                      setFormData(updatedFormData);
                      // Reset dependent dropdowns
                      setSubDistricts([]);
                      setVillages([]);
                    }}
                    required
                  >
                    <option value="">Select State</option>
                    <option value="MH">Maharashtra</option>
                    {/* Add other states as needed */}
                  </Select>
                  {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
                </FormGroup>
        
                <FormGroup>
                  <Label htmlFor="district">District</Label>
                  <Select
                    id="district"
                    name="district"
                    value={formData.district || ''}
                    onChange={handleDistrictChange}
                    disabled={!formData.state}
                    required
                  >
                    <option value="">Select District</option>
                    {formData.state === "MH" && maharashtraData.districts.map(({ district }) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </Select>
                  {errors.district && <ErrorMessage>{errors.district}</ErrorMessage>}
                </FormGroup>
        
                <FormGroup>
                  <Label htmlFor="subDistrict">Sub-District/Taluka</Label>
                  <Select
                    id="subDistrict"
                    name="subDistrict"
                    value={formData.subDistrict || ''}
                    onChange={handleSubDistrictChange}
                    disabled={!formData.district}
                    required
                  >
                    <option value="">Select Sub-District</option>
                    {subDistricts.map(({ subDistrict }) => (
                      <option key={subDistrict} value={subDistrict}>{subDistrict}</option>
                    ))}
                  </Select>
                  {errors.subDistrict && <ErrorMessage>{errors.subDistrict}</ErrorMessage>}
                </FormGroup>
        
                <FormGroup>
                  <Label htmlFor="village">Village/Area</Label>
                  <Select
                    id="village"
                    name="village"
                    value={formData.village || ''}
                    onChange={handleInputChange}
                    disabled={!formData.subDistrict}
                    required
                  >
                    <option value="">Select Village/Area</option>
                    {villages.map((village) => (
                      <option key={village} value={village}>{village}</option>
                    ))}
                  </Select>
                  {errors.village && <ErrorMessage>{errors.village}</ErrorMessage>}
                </FormGroup>
        
                <FormGroup>
                  <Label htmlFor="streetAddress">Street Address</Label>
                  <Input
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress || ''}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    required
                  />
                  {errors.streetAddress && <ErrorMessage>{errors.streetAddress}</ErrorMessage>}
                </FormGroup>
        
                <FormGroup>
                  <Label htmlFor="zipCode">Zip/Postal Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode || ''}
                    onChange={handleInputChange}
                    placeholder="12345"
                    required
                  />
                  {errors.zipCode && <ErrorMessage>{errors.zipCode}</ErrorMessage>}
                </FormGroup>
              </FormFields>
        
              <NavigationButtons>
                <BackButton onClick={prevStep}>
                  Back
                </BackButton>
                <NextButton onClick={nextStep}>
                  Next
                </NextButton>
              </NavigationButtons>
            </StepContainer>
          );
        
        case 4:
          return (
            <StepContainer className="face-verification-step">
              <h2>Step 4: Face Verification</h2>
              <CameraContainer>
                {!formData.faceImage ? (
                  <>
                    <VideoContainer>
                      <CameraFeed ref={videoRef} autoPlay playsInline muted />
                    </VideoContainer>
                    <CameraInstructions>
                      <p>Please center your face in the frame and ensure good lighting</p>
                      <CaptureButton onClick={captureImage}>
                        Capture Photo
                      </CaptureButton>
                    </CameraInstructions>
                  </>
                ) : (
                  <CapturedImageContainer>
                    <CapturedFace src={formData.faceImage} alt="Captured face" />
                    <RetakeButton onClick={() => {
                      setFormData({...formData, faceImage: null});
                      startCamera();
                    }}>
                      Retake Photo
                    </RetakeButton>
                  </CapturedImageContainer>
                )}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </CameraContainer>
              {errors.camera && <ErrorMessage>{errors.camera}</ErrorMessage>}
              
              <NavigationButtons>
                <BackButton onClick={prevStep}>
                  Back
                </BackButton>
                <SubmitButton 
                  onClick={handleSubmit} 
                  disabled={!formData.faceImage || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </SubmitButton>
              </NavigationButtons>
            </StepContainer>
          );
          
        default:
          return null;
      }
    };
    
    return (
      <Container>
        <Header>
          <Title>Voter Registration</Title>
          <ProgressIndicator>
            <ProgressBar>
              <Progress step={step} />
            </ProgressBar>
            <StepIndicators>
              {[1, 2, 3, 4].map(num => (
                <StepDot 
                  key={num} 
                  active={num <= step}
                >
                  {num}
                </StepDot>
              ))}
            </StepIndicators>
          </ProgressIndicator>
        </Header>
        
        <Form>
          {renderStep()}
        </Form>
        {showModal && (
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            background: "white", padding: "20px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            borderRadius: "8px", textAlign: "center", zIndex: 1000
          }}>
            <h3>Registration Successful</h3>
            <p>Your registration has been submitted successfully.</p>
            <button onClick={() => { setShowModal(false); window.location.href = "/"; }}>
              OK
            </button>
          </div>
        )}

      </Container>
    );
  };
  
  export default Registration;
