import React from 'react';
import { useNavigate } from 'react-router-dom';
import SplitAuthLayout from '../components/auth/SplitAuthLayout';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (user) => {
    localStorage.setItem('ecopulse_user', JSON.stringify(user));
    navigate('/dashboard');
  };

  return <SplitAuthLayout mode="signup" onSuccessNavigation={handleSuccess} />;
};

export default SignupPage;
