import { createContext } from "react";

function noop() {}

export const TargetContext = createContext( {
    key: null,
    currTarget:null,
    flyTo:null,    
    clearKey: noop,
    clearTarget: noop,    
})