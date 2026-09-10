import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { openAuthModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.redirect || '/products';

  React.useEffect(() => {
    openAuthModal('login', redirectPath);
    navigate('/', { replace: true });
  }, [openAuthModal, navigate, redirectPath]);

  return null;
};

export default Login;
