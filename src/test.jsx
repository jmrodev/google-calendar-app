import React, { useEffect, useState } from 'react';
const CLIENT_ID= "780740547474-k220451m1jvnrp43jkd1v6tm4shfnn7q.apps.googleusercontent.com"
const API_KEY= "AIzaSyCSECy16GA7fHV97TLi2bMR8SOy2CO2eiY"
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const loadGapi = () => {
            const script = document.createElement('script');
            script.src = "https://apis.google.com/js/api.js";
            script.onload = () => {
                window.gapi.load('client:auth2', () => {
                    window.gapi.client.init({
                        apiKey: API_KEY,
                        clientId: CLIENT_ID,
                        discoveryDocs: DISCOVERY_DOCS,
                        scope: SCOPES,
                    }).then(() => {
                        const authInstance = window.gapi.auth2.getAuthInstance();
                        setIsAuthenticated(authInstance.isSignedIn.get());
                        authInstance.isSignedIn.listen(setIsAuthenticated);
                    }).catch(error => {
                        console.error("Error initializing gapi client:", error);
                    });
                });
            };
            document.body.appendChild(script);
        };

        loadGapi();
    }, []);

    const handleLogin = () => {
        window.gapi.auth2.getAuthInstance().signIn();
    };

    const handleLogout = () => {
        window.gapi.auth2.getAuthInstance().signOut();
    };

    return (
        <div className="container">
            <h1>Prueba de Autenticación de Google</h1>
            {isAuthenticated ? (
                <div>
                    <h2>Usuario autenticado</h2>
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            ) : (
                <div>
                    <h2>No autenticado</h2>
                    <button onClick={handleLogin}>Iniciar Sesión</button>
                </div>
            )}
        </div>
    );
};

export default App;