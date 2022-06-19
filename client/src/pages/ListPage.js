import {Container, Table, TableBody, TableCell,TableHead, TableContainer,  TableRow, Paper, Typography} from "@mui/material";
import React, { useEffect, useState } from "react"
import { useHttp } from "../hooks/http.hooks";
import { GlobalContext } from "../context/GlobalContext"
import ModalLogout from "../components/ModalLogout";
import {Link} from 'react-router-dom'

export const ListPage = () =>{     
   //console.log("render List!!");
   const [list, setList] = useState([]);  
   const [page, setPage] = useState(); 
   const [logout, setLogout] = useState(false);
  
   const {loading, request} = useHttp();  
   const auth = React.useContext(GlobalContext)
    
   const timeoutList = React.useRef(null);   

   const readListFromServer = async ()=>{
       try{
           const response = await request('/mlat/list','GET',null,{
               Authorization: `Bearer ${auth.token}`
           });         
           setList(response.data);                       
       }catch(e){
            console.log("Error load List",e);
            if (String(e).includes('401')) 
                setLogout(true)
           
       }
   }

   const handleClick = (info)=>{
        console.log("Click!!", info);       
   }  

   React.useEffect(() =>{           
        timeoutList.current = setInterval(async ()=>{
            await readListFromServer()            
       },10000);
       return ()=> clearInterval(timeoutList.current)    
   },[])

   React.useEffect(() =>{                  
       readListFromServer()        
   },[]) 

    React.useEffect(() =>{                         
        
        if (list){
            if ( Object.keys(list).length>0){                               
                const mapArr = list.tracks
                const ap=mapArr.map((row,id)=>{                   
                    return(
                        <TableRow                         
                            hover                             
                            key={row.mode_s+id} 
                            onClick={() => {                             
                                handleClick(row.mode_s)                         
                            }}                             
                        >                                                
                            <TableCell>
                                <Typography
                                    component="h5"
                                    sx={{                                    
                                        background: row.mlat_status==='on'?"#0F0":
                                        row.adsb_status==='no-pos'?"#00000F":""
                                        }}
                                >
                                M
                                </Typography>                            
                                <Typography 
                                    sx={{
                                        background: row.adsb_status==='on'?"#0F0":
                                            row.adsb_status==='cpr-fail'?"lightblue":""
                                }}>
                                A
                                </Typography>
                            </TableCell>                                                             
                            <TableCell> 
                                <b><font color="green">
                                    {row.mode_s} 
                                </font>
                                <br/>
                                <font color="blue">
                                    {row.callsign}
                                </font></b>
                            </TableCell> 
                            <TableCell>
                                <b>{row.altitude}</b>
                            <br/>                                
                                {row.mode_flags.on_ground&&                                        
                                    <img src="/images/gnd.png" alt="grnd" width="16" />
                                }
                            </TableCell>                       
                        </TableRow>
                    )
                })
                setPage(ap);
            }
        }
    },[list]) 

    return (        
        <Container component="main" maxWidth="xl">  
            {logout && <ModalLogout/>}                      
            <TableContainer component={Paper} sx={{ mt:1,minWidth: 200}}>
                <Table stickyHeader   size="small">                    
                    <TableBody> 
                        {page}
                    </TableBody> 
                </Table>   
            </TableContainer>  
        </Container>
        
    )
}
