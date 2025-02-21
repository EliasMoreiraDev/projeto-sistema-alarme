import { useCallback } from 'react';

const useSuapClient = (authHost, clientID, redirectURI, scope) => {
  const resourceURL = `${authHost}/api/eu/`;
  const authorizationURL = `${authHost}/o/authorize/`;
  const logoutURL = `${authHost}/o/revoke_token/`;
  
  const responseType = 'token';

  const extractToken = () => {
    const match = window.location.hash.match(/access_token=([^&]+)/);
    return match ? match[1] : null;
  };

  const extractScope = () => {
    const match = window.location.hash.match(/scope=([^&]+)/);
    return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
  };

  const extractDuration = () => {
    const match = window.location.hash.match(/expires_in=(\d+)/);
    return match ? Number(match[1]) : 0;
  };

  const clearUrl = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const initToken = useCallback(() => {
    const tokenValue = extractToken();
    const expirationTime = extractDuration();
    const extractedScope = extractScope();

    if (tokenValue) {
      // Armazenando no localStorage
      localStorage.setItem('suapToken', tokenValue);
      localStorage.setItem('suapScope', extractedScope);
      localStorage.setItem('suapTokenExpiration', Date.now() + expirationTime * 1000);
      
    }

    return {
      tokenValue,
      expirationTime,
      scope: extractedScope,
    };
  }, []);

  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('suapToken');
    const tokenExpiration = localStorage.getItem('suapTokenExpiration');
    return token && tokenExpiration && Date.now() < tokenExpiration;
  }, []);

  const login = useCallback(() => {
    const loginUrl = `${authorizationURL}?response_type=${responseType}&client_id=${clientID}&scope=${scope}&redirect_uri=${redirectURI}`;
    window.location.href = loginUrl;
  }, [authorizationURL, responseType, clientID, scope, redirectURI]);

  const logoutHandler = useCallback(() => {
    const token = localStorage.getItem('suapToken');
    if (token) {
      // Revoke token from the server
      fetch(logoutURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          client_id: clientID,
        }),
      })
        .finally(() => {
          localStorage.removeItem('suapToken');
          localStorage.removeItem('suapScope');
          localStorage.removeItem('suapTokenExpiration');
        })
        .catch((error) => {
          console.error('Erro ao fazer logout:', error);
        });
    } else {
      localStorage.removeItem('suapToken');
      localStorage.removeItem('suapScope');
      localStorage.removeItem('suapTokenExpiration');
    }
  }, [logoutURL, clientID]);

  const getResource = useCallback(
    async (callback) => {
      const token = localStorage.getItem('suapToken');
      if (token) {
        try {
          const response = await fetch(resourceURL, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Token inválido ou expirado.');
          }

          const data = await response.json();
          callback(data);
        } catch (error) {
          console.error('Erro ao obter recursos:', error);
          logoutHandler();
        }
      } else {
        logoutHandler();
      }
    },
    [resourceURL, logoutHandler]
  );

  return {
    initToken,
    isAuthenticated,
    login,
    logout: logoutHandler,
    getResource,
  };
};

export default useSuapClient;
