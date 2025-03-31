export const useAuth = () => {
  const isAuthenticated = () => {
    // Replace with your authentication logic
    return localStorage.getItem('authToken') !== null;
  };

  const login = (token) => {
    // Replace with your login logic
    localStorage.setItem('authToken', token);
  };

  const logout = () => {
    // Replace with your logout logic
    localStorage.removeItem('authToken');
  };

  return { isAuthenticated, login, logout };
};
