import Cookies from 'js-cookie';

// Função para configurar e manipular cookies
const useCookie = () => {
  const setCookie = (key, value, options = {}) => {
    Cookies.set(key, value, { path: '/', ...options });
  };

  const getCookie = (key) => {
    return Cookies.get(key);
  };

  const removeCookie = (key) => {
    Cookies.remove(key);
  };

  return {
    setCookie,
    getCookie,
    removeCookie,
  };
};

export default useCookie;