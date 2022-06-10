import { useCallback, useState } from "react"
import {Snackbar, Alert, Stack} from '@mui/material';

export const useMessage = () =>{         

    return useCallback( (text, info) => {   
        console.log("useMessage", text, info);
        <Stack spacing={2} sx={{ position:"absolute", top:10, left:10}}>
            <Snackbar
                anchorOrigin={{vertical:'top', horizontal:'left'}}
                open={true}
                autoHideDuration={5000}                               
            >                            
                <Alert                     
                    severity='success'
                    sx={{ width: '100%' }}>
                    {text}
                </Alert>            
                </Snackbar>
            </Stack>    
    },[]);
}