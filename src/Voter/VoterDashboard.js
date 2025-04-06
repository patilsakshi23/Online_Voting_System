import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import banner1 from "../assets/voting_banner1.webp";
import {ChevronRight, CheckCircle, AlertCircle, Info } from 'lucide-react'

// Import Firebase
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

// Styled Components
const PageContainer = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;


const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  img {
    height: 3rem;
  }
  
  h2 {
    font-size: 1.25rem;
    color: #2e3c80;
    margin: 0;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const ProfileContainer = styled.div`
  position: relative;
`;

const ProfilePhoto = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: #2e3c80;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 0.5rem 0;
  min-width: 120px;
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 100;
`;

const DropdownItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const HeroSection = styled.div`
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: linear-gradient(to right,rgba(58, 123, 213, 0.14),rgba(58, 96, 115, 0.46));
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${banner1});
  background-size: cover;
  background-position: center;
  z-index: -1;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(28, 41, 90, 0.9) 0%, rgba(28, 41, 90, 0.7) 100%);
  }
`;

const ContentBox = styled.div`
  text-align: center;
  max-width: 900px;
  padding: 3.5rem;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const MainHeading = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color:rgb(5, 29, 107);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

const Button = styled.button`
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }
`;
const RegisterButton = styled(Button)`
  background: linear-gradient(to right, #3a7bd5, #3a6073);
  color: white;
  border: none;
  height: 60px;
  border-radius: 50px; 
  width: 270px;
  gap: 10px;
  
  &:hover {
    background: linear-gradient(to right, #3a7bd5, #3a6073);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const HText = styled.p`
  font-size: 21px;
  color:rgba(255, 255, 255, 0.73);
`;

const InfoBoxContainer = styled.div`
background-color: white;
border-radius: 0.5rem;
padding: 1.5rem;
margin-bottom: 2rem;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
border: 1px solid #93c5fd;
`;

const InfoBoxHeader = styled.div`
display: flex;
gap: 0.75rem;
align-items: flex-start;
`;

const InfoBoxTitle = styled.h3`
font-size: 1.8rem;
font-weight: 600;
color: #1e40af;
text-align: left;
margin-top: 0;
`;

const InfoItem = styled.div`
display: flex;
gap: 0.75rem;
align-items: flex-start;
margin-bottom: ${props => props.$isLast ? '0' : '0.5rem'};
`;

const InfoItemText = styled.p`
color: #374151;
text-align: left;
margin: 0;
line-height: 1.7;
font-size: 20px;
`;

const InfoIcon = styled.div`
color: #1d4ed8;
flex-shrink: 0;
margin-top: 0.65rem;
`;

const InfoIconHeader = styled.div`
color: #1d4ed8;
flex-shrink: 0;
margin-top: 0.65rem;
`;



const VoterDashboard = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const database = getDatabase();
  
  // const [currentSlide, setCurrentSlide] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    email: "",
    profileImage: null
  });
  const [loading, setLoading] = useState(true);
  
  // Fetch user information from Firebase
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const userId = user.uid;
        const userRef = ref(database, `users/${userId}`);
        
        // Get user data from Firebase Realtime Database
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            setUserInfo({
              firstName: userData.firstName || userData.name || "",
              email: user.email || "",
              profileImage: userData.profileImage || null
            });
          } else {
            // If no user data in database, use auth info
            const displayName = user.displayName || "";
            const firstName = displayName.split(" ")[0];
            
            setUserInfo({
              firstName: firstName,
              email: user.email || "",
              profileImage: user.photoURL || null
            });
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
      } else {
        // User is signed out, redirect to login
        navigate("/");
      }
    });
    
    return () => {
      unsubscribeAuth();
    };
  }, [auth, database, navigate]);
  
  // Generate profile image URL based on email (fallback to Gravatar or similar)
  const getProfileImageUrl = (email) => {
    if (!email) return null;
    
    // This is a placeholder. In a real app, you might want to implement
    // Gravatar or another service here.
    return null;
  };
  
  // Get user's first initial for display
  const getUserInitial = () => {
    if (userInfo && userInfo.firstName && userInfo.firstName.trim().length > 0) {
      return userInfo.firstName.trim().charAt(0).toUpperCase();
    }
    return "?"; // Default when name can't be determined
  };

  // Handle logout using Firebase Auth
  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful, navigate to home
      navigate("/");
    }).catch((error) => {
      console.error("Error signing out:", error);
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".profile-container")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Determine whether to show image or initial
  const profileImageUrl = userInfo.profileImage || getProfileImageUrl(userInfo.email);

  return (
    <PageContainer>
      <Header>
        <Logo>
          <img src="/images/vote-logo.png" alt="Voting System Logo" />
        </Logo>
        
        <HeaderRight>
          <ProfileContainer className="profile-container">
            <ProfilePhoto onClick={() => setDropdownOpen(!dropdownOpen)}>
              {loading ? (
                "..."
              ) : profileImageUrl ? (
                <img src={profileImageUrl} alt={`${userInfo.firstName}'s profile`} />
              ) : (
                getUserInitial()
              )}
            </ProfilePhoto>
            <DropdownMenu isOpen={dropdownOpen}>
              <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
            </DropdownMenu>
          </ProfileContainer>
        </HeaderRight>
      </Header>
      
      <HeroSection>
      <HeroBackground />
     
      <ContentBox>
      <MainHeading>Welcome to the Official Voting Platform</MainHeading>
        <HText>Complete the registration process before casting your vote in the ongoing election. Your participation matters in shaping our collective future.</HText>
        <InfoBoxContainer>
            <InfoBoxHeader>
              <InfoIconHeader>
                <Info size={24} />
              </InfoIconHeader>
              <InfoBoxTitle>Important Information</InfoBoxTitle>
            </InfoBoxHeader>
            
            <InfoItem>
              <InfoIcon>
                <AlertCircle size={20} />
              </InfoIcon>
              <InfoItemText>
                To participate in this election, you must first register with your valid ID and personal information.
              </InfoItemText>
            </InfoItem>
            
            <InfoItem $isLast={true}>
              <InfoIcon>
                <CheckCircle size={20} />
              </InfoIcon>
              <InfoItemText>
                Once registered, you will be eligible to cast your vote. Please ensure all provided information is accurate and matches your official records.
              </InfoItemText>
            </InfoItem>
          </InfoBoxContainer>

        <ButtonContainer>
          <RegisterButton onClick={() => navigate("/register")}>
            Register to Vote
            <ChevronRight className="h-4 w-4" />
          </RegisterButton>
        </ButtonContainer>
      </ContentBox>
    </HeroSection>
    </PageContainer>
  );
};

export default VoterDashboard;