import { createContext } from "react";

function noop() {}

export const GlobalContext = createContext( {
    token: null,
    userId:null,
    userName:null,
    login: noop,
    logout: noop,
    isAuthenticated: false,
    showMLAT:true, 
    showADSB:true

})