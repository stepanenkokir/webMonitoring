import {useState, useCallback, useEffect} from 'react'

export const useTarget = () =>{
    const [key, setKey] = useState(null);   
    const [currTarget, setCurrTarget] = useState(null);    
   
    const clearKey = useCallback( ()=> {
        setKey(null);        
    }, [])

    const clearTarget = useCallback( ()=> {       
        currTarget(null);      
    }, [])

    const appendKey = useCallback( (k)=> {
        setKey(k)     
    }, [])

    useEffect(()=>{
         // console.log("HOOK TARGET NEW KEY = ",key) 
    },[key])

    return {key, currTarget, clearTarget, clearKey}
}