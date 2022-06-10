import { useState, useCallback } from "react";

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const request = useCallback (async (url, method='GET', body = null, headers ={}) =>{
        setLoading(true);
        try{
            if (body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }          
            const response = await fetch(url, {method, body, headers})
            const data = await response.json();

            if (!response.ok) {
              //  console.log("Error in response!!!",response.status, data.message);                
                if (response.status===500 || response.status===400 )
                    throw new Error (data.message);
                else
                    throw new Error (response.status);
            }
            setLoading(false);
            return data;

        }catch (e) {            
           // console.log("ERRORR FETCH ERROR=...",e.message, e.status);
            setLoading(false);
            setError(e);
            throw e.message;
        }
    }, [])

    const clearError = useCallback( () =>setError(null),[]);

    const chLoading = (check) =>setLoading(check);

    return {loading, request, error, clearError};
}