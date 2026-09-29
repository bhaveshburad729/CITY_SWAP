import React from 'react';
import { useNavigate } from 'react-router-dom';
import SplitAuthLayout from '../components/auth/SplitAuthLayout';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (user) => {
    localStorage.setItem('ecopulse_user', JSON.stringify(user));
    if (user?.role === 'driver') {
      navigate('/driver');
    } else if (user?.role === 'admin' || user?.role === 'collector') {
      navigate('/admin');
    } else {
      navigate('/citizen');
    }
  };

  return <SplitAuthLayout mode="signup" onSuccessNavigation={handleSuccess} />;
};

export default SignupPage;
