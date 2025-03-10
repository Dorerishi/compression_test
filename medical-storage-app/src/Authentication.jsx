import { createContext,useContext,useState,useEffect } from "react";
import { auth,onAuthStateChanged, signOut } from "./services/firebase";


const AuthContext = createContext();

export const AuthProvider = ({ children }) =>{
    
    const [user,setUser] = useState(null);

    useEffect(() =>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
          });
          return () => unsubscribe();
    },[]);

    const logout = async () => {
        await signOut(auth);
      };
    return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
    ); 
};

export const useAuth = () => useContext(AuthContext);