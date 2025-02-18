import React, { createContext, useContext, useState, Dispatch, SetStateAction } from "react";
import { AppData } from "../types/app-data";
import { User } from "../model/user";

const defaultUserData = new User();

interface AppDataContextType {
  appData: AppData;
  setAppData: Dispatch<SetStateAction<AppData>>;
}

export const AppDataContext = createContext<AppDataContextType>({
  appData: { user: defaultUserData, isLoggedIn: false },
  setAppData: () => {}, // Placeholder
});

export const AppDataProvider = ({ children }:{children:React.ReactNode}) => {
  const [appData, setAppData] = useState<AppData>({
    user: defaultUserData,
    isLoggedIn: false,
  });

  return (
    <AppDataContext.Provider value={{ appData, setAppData }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }
  return context;
};