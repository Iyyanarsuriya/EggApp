import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { openAuthModal } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    openAuthModal('signup');
    navigate('/', { replace: true });
  }, [openAuthModal, navigate]);

  return null;
};

export default Register;
