import { createContext, useContext, useState } from "react";


const stateContext=createContext();

export const ContextProvider=({children})=>{
    const [isAuth,setIsAuth]=useState(false);
    const [isLogin,setIsLogin]=useState(true);

    return(
        <stateContext.Provider value={{
            isAuth,
            setIsAuth,
            isLogin,
            setIsLogin
        }}
        >{children}</stateContext.Provider>
    )
}


export const useStateContext=()=>useContext(stateContext)