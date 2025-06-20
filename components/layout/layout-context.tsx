"use client";
import React, { useState, useContext } from "react";
import type { Global } from '.contentlayer/generated';

interface LayoutState {
  globalSettings: Global | null;
  setGlobalSettings: React.Dispatch<React.SetStateAction<Global | null>>;
  pageData: any;
  setPageData: React.Dispatch<React.SetStateAction<any>>;
  theme: any;
}

const LayoutContext = React.createContext<LayoutState | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  return context;
};

interface LayoutProviderProps {
  children: React.ReactNode;
  globalSettings: Global | null;
  pageData: any;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({
  children,
  globalSettings: initialGlobalSettings,
  pageData: initialPageData,
}) => {
  const [globalSettings, setGlobalSettings] = useState<Global | null>(
    initialGlobalSettings
  );
  const [pageData, setPageData] = useState<any>(initialPageData);

  const theme = globalSettings?.theme;

  return (
    <LayoutContext.Provider
      value={{
        globalSettings,
        setGlobalSettings,
        pageData,
        setPageData,
        theme,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
