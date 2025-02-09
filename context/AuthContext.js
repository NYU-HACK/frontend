import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  verifiedUser: null,
  setVerifiedUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [verifiedUser, setVerifiedUser] = useState(null);
  return (
    <AuthContext.Provider value={{ verifiedUser, setVerifiedUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
