import * as React from "react";
import { useState, useEffect, createContext, useContext } from "react";

export const AuthContext = createContext();

export function useAuthContext() {
  return useContext(AuthContext);
}



export const AuthContextProvider = ({children}) => {

    const [user, setUser] = useState(false);
    const [error, setError] = useState(false);

    // Checks for user cookie for login persistance
    useEffect(() => {
        async function checkIfUserIsLoggedIn() {
          try {
            let response = await fetch("/api/auth/login");
            if (!response.ok) {
              throw new Error("Unauthenticated");
            }
            let fetchedUser = await response.json();
            setUser(fetchedUser);
          } catch (error) {
            setUser(false);
            setError(true)
          }
        }
    
        checkIfUserIsLoggedIn();
    
        return () => {
          // clean up function
        };
      }, []);


    // authenticate user 
    const login = async (email, password) => {
    
    let response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Login Failed");
    }

    let loggedInUser = await response.json();
    setUser(loggedInUser);

    return loggedInUser;
    };
    
    // create new user
    const signup = async (credentials) => {
      
    let response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Login Failed");
    }

    let loggedInUser = await response.json();
    setUser(loggedInUser);

    return loggedInUser;
    };
    
    // signout user
    const logout = async () => {
        let response = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Logout Failed");
        }
    
        let body = await response.json();
        setUser(false);
    
        return body;
      };



    const authVariables = {user, setUser, login, logout, signup}
    return (
        <AuthContext.Provider value={{authVariables}}>
            {children}
        </AuthContext.Provider>
    )
}