import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const [loading, setLoading] = useState(true);

 useEffect(() => {

    const init = async () => {
        await checkAuth();
    };

    init();

}, []);

  const checkAuth = async () => {

  try {

    const res = await api.get("/auth/me");

    console.log("ME API Response:", res.data);

    setUser(res.data.user);

  } catch (error) {

    console.log("ME API Error:", error.response?.data);

    setUser(null);

  }

  setLoading(false);

};
  return (

    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        checkAuth,
        sessionExpired,
        setSessionExpired
      }}
    >
      {children}
    </AuthContext.Provider>

  );

};

export const useAuth = () => useContext(AuthContext);