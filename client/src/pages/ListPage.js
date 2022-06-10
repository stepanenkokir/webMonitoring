import {Container, Table, TableBody, TableCell,TableHead, TableContainer,  TableRow, Paper} from "@mui/material";
import React, { useEffect, useState } from "react"
import { useHttp } from "../hooks/http.hooks";
import { AuthContext } from "../context/AuthContext"
import ModalLogout from "../components/ModalLogout";
import {Link} from 'react-router-dom'

export const ListPage = () =>{     
   //console.log("render List!!");
   const [list, setList] = useState([]);  
   const [page, setPage] = useState(); 
   const [logout, setLogout] = useState(false);
  
   const {loading, request} = useHttp();  
   const auth = React.useContext(AuthContext)
    
   const timeoutList = React.useRef(null);   

   const readListFromServer = async ()=>{
       try{
           const response = await request('/mlat/list','GET',null,{
               Authorization: `Bearer ${auth.token}`
           });         
           setList(response.data);                       
       }catch(e){
            console.log("Error load List",e);
            if (String(e).startsWith('Error: 401')) 
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
                            // component={Link}
                            // to={'/icao'+row.mode_s}
                            key={row.mode_s+id} 
                            onClick={() => {                             
                                handleClick(row.mode_s)                         
                            }}                             
                        >                                                
                            <TableCell
                            sx={{
                                background: row.mlat_status==='on'?"#0F0":
                                            row.adsb_status==='no-pos'?"#00F":""
                            }}
                            >
                                M                                 
                            </TableCell>
                            <TableCell sx={{
                                background: row.adsb_status==='on'?"#0F0":
                                            row.adsb_status==='cpr-fail'?"#00F":""
                            }}>
                                A
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
                            </TableCell>     
                            <TableCell>
                                {row.movement_mode_symbol}
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
            <TableContainer component={Paper} sx={{ mt:1,minWidth: 300}}>
                <Table stickyHeader  aria-label="a dense table" size="small"  >
                    <TableHead  aria-label="simple table">                                
                        <TableRow sx={{textAlign:"center"}}>                             
                            <TableCell>
                            </TableCell>
                            <TableCell>
                            </TableCell> 
                            <TableCell>                            
                            </TableCell>                            
                            <TableCell>                                 
                            </TableCell> 
                            <TableCell>                               
                            </TableCell>                                
                        </TableRow>
                    </TableHead>
                    <TableBody> 
                        {page}
                    </TableBody> 
                </Table>   
            </TableContainer>  
        </Container>
        
    )
}
