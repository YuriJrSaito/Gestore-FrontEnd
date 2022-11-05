import Routes from "./Routes.js";
import {createContext, useState} from "react";

export const ThemeContext = createContext(null);

export default function App() {
    const [theme, setTheme] = useState("dark");

    const toggleTheme = () =>{
        setTheme((curr) => (curr === "light" ? "dark" : "light"));
    }
    
   return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            <div className='app' id={theme}>
                <Routes/>
            </div>
        </ThemeContext.Provider>
   );
}