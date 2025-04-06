import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import banner1 from "../assets/voting_banner1.webp";
import banner2 from "../assets/voting_banner2.webp";
import banner3 from "../assets/voting_banner3.jpg";

// Styled Components
const PageContainer = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  min-height: 100vh;
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

const LanguageSelector = styled.select`
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled.button`
  background: transparent;
  border: none;
  font-size: 1rem;
  color: #2e3c80;
  cursor: pointer;
  padding: 0.5rem 1rem;
  position: relative;
  
  &:hover {
    color: #1a237e;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #1a237e;
    }
  }
`;

const LoginButton = styled(NavLink)`
  font-weight: 500;
`;

const SignupButton = styled(NavLink)`
  font-weight: 600;
  background-color: #2e3c80;
  color: white;
  border-radius: 4px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #1a237e;
    color: white;
    
    &::after {
      display: none;
    }
  }
`;



const AnnouncementBanner = styled.div`
  background-color: #f44336;
  color: white;  /* Set font color to black */
  display: flex;
  align-items: center;
  padding-top: 40px;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  font-weight: 500;
  font-size: 23px;
  height: 30px;
`;


const ScrollingText = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  animation: scroll-left 20s linear infinite;
  
  @keyframes scroll-left {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
`;

const HeroSection = styled.div`
  height: 85.3vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  overflow: hidden;
`;

const SliderBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1000px;
  z-index: -1;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    position: absolute;
    transition: opacity 1s ease-in-out;
    
    &.active {
      opacity: 1;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const ContentBox = styled.div`
  text-align: center;
  max-width: 850px;
  height: 350px;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  z-index: 1;
`;

const MainHeading = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Subheading = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.5;
`;

const RegisterButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 600;
  text-transform: uppercase;
  
  &:hover {
    background-color: #388e3c;
  }
`;

const VoterButton = styled.button`
  background-color: #f5f5f5;
  color: #2e3c80;
  border: 2px solid #2e3c80;
  padding: 1rem 2.5rem;
  font-size: 1.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 1rem;
  
  &:hover {
    background-color: #2e3c80;
    color: white;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [banner1, banner2, banner3];
  
  // Slideshow Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <PageContainer>
      <Header>
        <Logo>
          <img src="/images/vote-logo.png" alt="Voting System Logo" />
        </Logo>
        
        <HeaderRight>
          <LanguageSelector>
            <option value="en">English</option>
            <option value="mr">मराठी</option>
            <option value="hi">हिन्दी</option>
          </LanguageSelector>
          
          <NavLinks>
            <LoginButton onClick={() => navigate("/login")}>Login</LoginButton>
            <SignupButton onClick={() => navigate("/signup")}>Sign Up</SignupButton>
          </NavLinks>
        </HeaderRight>
      </Header>
      

      <AnnouncementBanner>
        <ScrollingText>
          IMPORTANT ANNOUNCEMENT: National Elections will be held on May 15, 2025. Voter registration deadline: April 20, 2025. Make sure your voice is heard!
        </ScrollingText>
      </AnnouncementBanner>
      
      <HeroSection>
        <SliderBackground>
          {slides.map((slide, index) => (
            <img 
              key={index} 
              src={slide} 
              alt={`Voting slide ${index + 1}`} 
              className={index === currentSlide ? "active" : ""}
            />
          ))}
        </SliderBackground>
        
        <ContentBox>
          <MainHeading>Your Vote, Your Voice, Your Future</MainHeading>
          <Subheading>
            Participate in the democratic process through our secure online voting platform.
            Register today to ensure your voice is heard in the upcoming election.
          </Subheading>
          <RegisterButton onClick={() => navigate("/register")}>Register to Vote</RegisterButton>
          <VoterButton onClick={() => navigate("/voter")}>Voter Portal</VoterButton>
        </ContentBox>
      </HeroSection>
    </PageContainer>
  );
};

export default Home;