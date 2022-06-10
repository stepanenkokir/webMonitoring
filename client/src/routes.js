import React from "react"
import { Navigate, Route, Routes } from 'react-router-dom';
import { SignIn } from "./pages/AuthPage"
import { ListPage } from "./pages/ListPage"
import { MapPage } from "./pages/MapPage"
import { StatusPage } from "./pages/StatusPage"
import { SettingsPage } from "./pages/SettingsPage"

export const useRoutes = (isAuthenticated) =>{	
	//console.log("Routes ", isAuthenticated);
	
    if (isAuthenticated){							
        return( 		    			
				<Routes>
					<Route path="/" element={<MapPage />} /> 
					<Route path="/:icao" element={<MapPage />} />					
					<Route path="/settings" element={<SettingsPage />} />
					<Route path="/stat" element={<StatusPage />} />
					<Route path="/list" element={<ListPage />} />					

					<Route
						path="*"
						element={<Navigate to="/" />}
					/>
				</Routes> 			
        )
    }
    return(       
        <Routes>
    		<Route path="*" element={<SignIn />} />    		    		
  		</Routes>
        
    )
}

/*



return(       
        <Routes>
    		<Route path="/auth" element={<SignIn />} />    		
    		<Route
        		path="*"
        		element={<Navigate to="/auth" />}
    		/>
  		</Routes>
        
    )


 

*/