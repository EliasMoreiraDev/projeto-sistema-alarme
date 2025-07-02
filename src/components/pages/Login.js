import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSuapClient from '../../login_suap/client';  // Ajuste o caminho conforme necessário
import Loading from '../layouts/Loading';  // Ajuste o caminho conforme necessário
import {ip} from '../ip'
const Login = () => {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(true);  // Estado para controlar o carregamento

  const clientID = 'S3uUVTw2uvD0hixw0zsrJxlNJt8aWIPXU70LhtYH';
  const redirectURI = `http://${ip}:3000/times`;
  const authHost = 'https://suap.ifro.edu.br';
  const scope = 'identificacao email documentos_pessoais';

  const { login } = useSuapClient(authHost, clientID, redirectURI, scope);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 7500);

    return () => clearTimeout(timer); 
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loggedOut = urlParams.get('logged_out');
    
    if (loggedOut === 'true') {
      console.log('Você saiu com sucesso. Faça login novamente.');
    }
  }, []);

  const handleLogin = () => {
    login();
  };

  return (
    <div>
      {showLoading ? (
        <Loading />  
      ) : (
        handleLogin()
      )}
    </div>
  );
};

export default Login;
