export default function useAuth() {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  return {
    isAuthenticated: !!user && !!token,
    user: user ? JSON.parse(user) : null,
    token: token || null,
    login: (userData: object, authToken: string) => {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);
    },
    logout: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  };
}