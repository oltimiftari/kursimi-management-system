import {createContext, useState} from "react";

const AppContext = createContext();

export const AppContextProvider = ({children}) => {

    const [user, setUser] = useState(null);

    const contextValue = {
        user
    }

    return (
        <AppContextProvider value={contextValue}>
            {children}
        </AppContextProvider>
    )
}