import { useRef } from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import useSuapClient from '../login_suap/client';
import Cookies from 'js-cookie';
import { ip } from '../components/ip';
import Loading from '../components/layouts/Loading';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); 
    const [users, setUsers] = useState([]);

    const clientID = 'S3uUVTw2uvD0hixw0zsrJxlNJt8aWIPXU70LhtYH';
    const redirectURI = `http://${ip}:3000/times`;
    const authHost = 'https://suap.ifro.edu.br';
    const scope = 'identificacao email documentos_pessoais';

    const { getResource, logout, isAuthenticated: checkAuth } = useSuapClient(
        authHost,
        clientID,
        redirectURI,
        scope
    );

    const hasAlertedRef = useRef(false); // Flag para evitar múltiplos alertas

    // Função para buscar usuários
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log('Iniciando fetch para usuários...');
                const response = await fetch(`http://${ip}:5000/users`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erro na resposta da API: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Dados recebidos da API de usuários:', data);
                setUsers(data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
                if (!hasAlertedRef.current) {
                    alert('Erro ao buscar usuários autorizados. Por favor, tente novamente mais tarde.');
                    hasAlertedRef.current = true;
                }
            }
        };

        fetchUsers();
    }, [ip]);

    // Verificar autenticação após carregar os usuários
    useEffect(() => {
        const verifyAuthentication = () => {
            const tokenInfo = Cookies.get('suapToken');
            if (tokenInfo) {
                getResource((data) => {
                    if (data) {
                        console.log("Identificação do usuário autenticado:", data.identificacao);
                        // Verificar se o usuário autenticado está na lista de usuários
                        const userExists = users.some(user => user.identificacao.trim() === data.identificacao.trim());
                        console.log('Usuário está na lista de usuários autorizados:', userExists);
                        if (userExists) {
                            setIsAuthenticated(true);
                        } else {
                            if (!hasAlertedRef.current) {
                                alert('Você não tem acesso a esta área.');
                                hasAlertedRef.current = true;
                            }
                            logout();
                            setIsAuthenticated(false);
                        }
                    } else {
                        if (!hasAlertedRef.current) {
                            alert('Erro ao obter dados do usuário.');
                            hasAlertedRef.current = true;
                        }
                        logout();
                        setIsAuthenticated(false);
                    }
                });
            } else {
                const authStatus = checkAuth();
                console.log('Status de autenticação sem token:', authStatus);
                setIsAuthenticated(authStatus);
                console.log("veio pra ca");
            }
        };

        // Apenas verificar autenticação se os usuários já foram carregados
        if (users.length > 0) {
            verifyAuthentication();
        }
    }, [users, getResource, logout, checkAuth]);

    if (isAuthenticated === null) {
        return <Loading />;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
