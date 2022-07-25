import React from "react"
import { Navigate, Route, Routes } from 'react-router-dom';
import { SignIn } from "./pages/AuthPage"
import { SettingsPage } from "./pages/SettingsPage"
import { MapPage } from "./pages/MapPage"

export const useRoutes = (isAuthenticated) =>{	
	//console.log("Routes ", isAuthenticated);
	
    if (isAuthenticated){							
        return( 		    			
				<Routes>
					<Route path="/" element={<MapPage />} />			
					<Route path="/settings" element={<SettingsPage />} />
					<Route path="/stat" element={<MapPage stat/>} />
					<Route path="/list" element={<MapPage list />} />
					<Route path="/mosq" element={<MapPage mosq />} />
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