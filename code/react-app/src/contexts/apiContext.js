import React, {createContext, useContext} from 'react';

const ApiContext = createContext();

export const ApiProvider = ({children}) => {
  const apiUrl = 'http://mysite.local/api';

  return (
    <ApiContext.Provider value={apiUrl}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
