import React, {useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom"
import "./App.css";
import { useRoutes } from "./routes";
import { useAuth } from "./hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/AppBar";


export default function App() {  
	const {token,login, logout, userId, userName} = useAuth(); 	
	const isAuthenticated = !!token;
	
	const [myroute, setMyRoute] = useState()


	useEffect(()=>{
		setMyRoute( useRoutes(isAuthenticated))
	},[isAuthenticated])
	

	return (
		<AuthContext.Provider value={{
			token,login, logout, userId, userName, isAuthenticated
		}}>			
			<BrowserRouter>								
				{isAuthenticated&&<Navbar /> }
				<div className="contain">
					{myroute}
				</div>
			</BrowserRouter>
		</AuthContext.Provider>		
	)

}

 
