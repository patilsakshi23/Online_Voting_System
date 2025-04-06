import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import CandidateRegistration from "./CandidateRegistration";
import Vote from "./Vote";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const SidebarContainer = styled.div`
  background-color:rgb(14, 20, 94);
  width: 330px;
  height: 100vh;
  color: white;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the items horizontally */
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  padding: 10px 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 0 10px 20px 10px;
`;

const NavSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center navigation links */
`;

const StyledNavItem = styled.div`
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: white;
  text-decoration: none;
  display: block;
  text-align: center; /* Center text within links */
  width: 85%; /* Give some room on the sides */
  margin-bottom: 5px;
  font-size: 18px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background-color: rgba(255, 255, 255, 0.15);
    font-weight: 500;
  }
`;

const DropdownItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
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

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
`;

const PageContainer = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-y: auto; /* Enable vertical scrolling */
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const database = getDatabase();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
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

  // Handle sidebar item click - special case for Voter Authentication
  const handleNavClick = (name) => {
    if (name === 'Voter Verification') {
      navigate('/admin/voter-authentication');
    } else if (name === 'Results') {
      navigate('/election-results');
    }
     else {
      setActiveSection(name);
    }
  };

  // Navigation links configuration
  const navLinks = [
    { name: 'Dashboard' },
    { name: 'Add Candidates' },
    { name: 'Voter Verification' },
    { name: 'Vote' },
    { name: 'Results' },
  ];

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <h1>Dashboard</h1>;
      case 'Add Candidates':
        return <CandidateRegistration/>;
      case 'Vote':
        return <Vote/>;
      default:
        return <h1>Dashboard</h1>;
    }
  };
  
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

      <div style={{ display: 'flex' }}>
        <SidebarContainer>
          <NavSection>
            {navLinks.map(link => (
              <StyledNavItem
                key={link.name}
                className={activeSection === link.name ? 'active' : ''}
                onClick={() => handleNavClick(link.name)}
              >
                {link.name}
              </StyledNavItem>
            ))}
          </NavSection>
        </SidebarContainer>
        
        <ContentContainer>
          {renderContent()}
        </ContentContainer>
      </div>
    </PageContainer>
  );
};

export default AdminDashboard;