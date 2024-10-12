"use client"


import { createContext, useContext, useEffect, useState } from 'react';

const DataContext = createContext();

export const useDataContext = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [wallet_address, setWallet_Address] = useState(localStorage.getItem('wallet_address') || '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user/${wallet_address}`, {
          headers: {
            'wallet-address': wallet_address
          }
        });
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Remove wallet_address from the dependency array

  const handleWalletAddressChange = (newWalletAddress) => {
    setWallet_Address(newWalletAddress);
    localStorage.setItem('wallet_address', newWalletAddress);
  };

  return (
    <DataContext.Provider value={{ data, wallet_address, setWallet_Address, handleWalletAddressChange }}>
      {children}
    </DataContext.Provider>
  );
};