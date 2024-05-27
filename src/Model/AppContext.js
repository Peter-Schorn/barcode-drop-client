import React from "react";

import { useState } from "react";


import { createContext } from 'react';

export const AppContext = createContext({});

export const ContextProvider = ({ children }) => {
    const [items, setItems] = useState(0);
 
    return (
        <AppContext.Provider value={{ items, setItems }}>
            {children}
        </AppContext.Provider>
    );
};
