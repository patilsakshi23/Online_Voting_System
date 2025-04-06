// Login.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
// Import your Firebase configuration
import { database, app } from "../FirebaseConfig.js";
import { useNavigate } from 'react-router-dom';
import Google from "../assets/google.png";

// Initialize Firebase Auth using the app from your config file
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


// Styled Components
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  height: 48px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3a80d2;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const GoogleButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background-color: white;
  color: #5f6368;
  border: 1px solid #dadce0;
  border-radius: 4px;
  padding: 12px 16px;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 500;
  width: 100%;
  height: 55px;
  max-width: 400px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s, box-shadow 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  img, svg {
    width: 25px;
    height: 25px;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SwitchText = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #666;
`;


const ForgotPassword = styled.p`
  text-align: right;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const ForgotPasswordLink = styled.span`
  color: #4a90e2;
  cursor: pointer;
  text-decoration: underline;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
  }
  
  span {
    padding: 0 10px;
    color: #666;
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  
  // Function to check user role and redirect accordingly
  const checkUserRoleAndRedirect = async (userId) => {
    try {
      // First, check the userRoles collection
      const userRoleRef = ref(database, `userRoles/${userId}`);
      const userRoleSnapshot = await get(userRoleRef);
      
      if (userRoleSnapshot.exists()) {
        const userData = userRoleSnapshot.val();
        const role = userData.role;
        
        // Redirect to appropriate dashboard based on role
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/voter-dashboard');
        }
      } else {
        // If no role found, default to voter
        navigate('/voter-dashboard');
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      // Default redirect if error
      navigate('/voter-dashboard');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in existing user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check user role and redirect
      await checkUserRoleAndRedirect(user.uid);
      
    } catch (error) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
        setError('Invalid email or password. Please try again.');
      } else if (error.code === 'auth/user-disabled') {
        setError('This account has been disabled. Please contact support.');
      } else {
        setError(`Login failed: ${error.message}`);
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if this Google user exists in our database
      const userRef = ref(database, `userRoles/${user.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        // User exists, check role and redirect
        await checkUserRoleAndRedirect(user.uid);
      } else {
        // New Google user, save as a voter by default
        await set(ref(database, `users/voters/${user.uid}`), {
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          email: user.email,
          role: 'voter',
          createdAt: new Date().toISOString(),
          authProvider: 'google'
        });
        
        await set(ref(database, `userRoles/${user.uid}`), {
          role: 'voter'
        });
        
        // Redirect to voter dashboard
        navigate('/voter-dashboard');
      }
    } catch (error) {
      setError(`Google sign-in failed: ${error.message}`);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent. Check your inbox.');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Login to Your Account</Title>
        <Form onSubmit={handleFormSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <ForgotPassword>
            <ForgotPasswordLink onClick={handleForgotPassword}>
              Forgot password?
            </ForgotPasswordLink>
          </ForgotPassword>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Login'}
          </Button>
          
          <Divider>
            <span>OR</span>
          </Divider>
          
          <GoogleButton type="button" onClick={handleGoogleSignIn} disabled={loading}>
          <img src={Google} alt="Google logo" />
          Continue with Google
          </GoogleButton>

        </Form>
        
        <SwitchText>
          Don't have an account? <a href="/signup">Sign Up</a>
        </SwitchText>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;