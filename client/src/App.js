import React, {useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom"
import "./App.css";
import { useRoutes } from "./routes";
import { useAuth } from "./hooks/auth.hook";
import { GlobalContext } from "./context/GlobalContext";
import Navbar from "./components/AppBar";

export default function App() {  
	const {token,login, logout, userId, userName} = useAuth(); 	
	const isAuthenticated = !!token;
	const showMLAT = true
	const showADSB  = true
	const showLines = true

	const [myroute, setMyRoute] = useState()

	useEffect(()=>{
		setMyRoute( useRoutes(isAuthenticated))
	},[isAuthenticated])
	
	return (
		<GlobalContext.Provider value={{
			token,login, logout, userId, userName, isAuthenticated, showMLAT, showADSB, showLines
		}}>
			<BrowserRouter>
				{isAuthenticated&&<Navbar /> }
					{myroute}			
			</BrowserRouter>
		</GlobalContext.Provider>
	)
}