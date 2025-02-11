import React from 'react';
import useSuapClient from './client'; 
import './login.css';
import Container from '../components/layouts/Container';

const SuapLogin = () => {
  const clientID = 'S3uUVTw2uvD0hixw0zsrJxlNJt8aWIPXU70LhtYH';
  const redirectURI = 'http://localhost:3000/times';
  const authHost = 'https://suap.ifro.edu.br';
  const scope = 'identificacao email documentos_pessoais';
  
  const { login } = useSuapClient(authHost, clientID, redirectURI, scope);
  
  return login();/*(
    <Container customClass='min-heigth'>
      <div className='container'>
        <div className='form'>
          <h1 className='titulo'>Bem-vindo ao Sistema de Controle de Alarmes do IFRO Campus Vilhena</h1>
          <button onClick={login} className="btn-primary">
            Entrar via Suap
          </button>
        </div>
      </div>
    </Container>
  );*/ 
};

export default SuapLogin;
