import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useSuapClient from '../login_suap/client';
import Loading from '../components/layouts/Loading';
import { ip } from '../components/ip';

export default function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [alertShown, setAlertShown] = useState(false);

  const clientID = 'S3uUVTw2uvD0hixw0zsrJxlNJt8aWIPXU70LhtYH';
  const redirectURI = 'http://localhost:3000/times';
  const authHost = 'https://suap.ifro.edu.br';
  const scope = 'identificacao email documentos_pessoais';

  const { getResource, logout } = useSuapClient(authHost, clientID, redirectURI, scope);

  // Carrega usuários autorizados
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://${ip}:5000/users`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Erro ao buscar usuários cadastrados.');

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar a lista de usuários autorizados.');
      }
    };

    fetchUsers();
  }, []);

  // Verifica autenticação e autorização
  useEffect(() => {
    const verifyAuthentication = async () => {
      const token = localStorage.getItem('suapToken');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        await getResource((data) => {
          const userIsAuthorized = users.some((user) => user.identificacao === data.identificacao);

          if (userIsAuthorized) {
            setIsAuthenticated(true);
          } else {
            logout();
            if (!alertShown) {
              alert('Você não tem permissão para acessar esta página.');
              setAlertShown(true);
            }
             
          }
        });
      } catch (error) {
        console.error('Erro durante a verificação de autenticação:', error);
        logout(); 
      } finally {
        setLoading(false);
      }
    };

    if (users.length > 0) {
      verifyAuthentication();
    }
  }, [users, alertShown, getResource, logout]);

  if (loading) {
    return <Loading />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}
