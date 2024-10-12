"use client"
import { useEffect, useState } from 'react';

const GetUser = () => {
  const [data, setData] = useState(null);
  const [wallet_address, setWalletAddress] = useState(localStorage.getItem('wallet_address') || '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user/${wallet_address}`, {
          headers: {
            'wallet-address': wallet_address
          }
        });
        const data = await response.json();
        console.log(data.data)
        setData(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [wallet_address]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-gray-600">
      <h1 className="text-xl font-bold">{data.fullname}</h1>
      <div className="flex justify-between">
        <p className="text-base">@{data.username  || 'Username...'}</p>
        <div className="flex items-center justify-between gap-2">
          <svg className="" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="17" height="17" viewBox="0 0 48 48">
          <path d="M 10.5 8 C 6.9280619 8 4 10.928062 4 14.5 L 4 33.5 C 4 37.071938 6.9280619 40 10.5 40 L 37.5 40 C 41.071938 40 44 37.071938 44 33.5 L 44 14.5 C 44 10.928062 41.071938 8 37.5 8 L 10.5 8 z M 10.5 11 L 37.5 11 C 39.450062 11 41 12.549938 41 14.5 L 41 15.605469 L 24 24.794922 L 7 15.605469 L 7 14.5 C 7 12.549938 8.5499381 11 10.5 11 z M 7 19.015625 L 23.287109 27.820312 A 1.50015 1.50015 0 0 0 24.712891 27.820312 L 41 19.015625 L 41 33.5 C 41 35.450062 39.450062 37 37.5 37 L 10.5 37 C 8.5499381 37 7 35.450062 7 33.5 L 7 19.015625 z"></path>
          </svg>
          <p className="text-base">{data.email || 'Email...'}</p>
        </div>
        <p className="text-base font-medium">{data.occupation || 'Specialization...'}</p>
      </div>
      <div className="flex justify-between">
        <div className="flex">
          <p>{data.location  ||  "Location..."}</p>
        </div>
        <a className="text-blue-700" href={data.portfolio}>{data.portfolio || 'portfolio...'}</a>
        <p>{data.joinedAt || 'joinedAt...'}</p>

      </div>
      <div className="flex">
        <p>{data.wallet_address}</p>
        {/* <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAYklEQVR4nGNgGE7Am4GB4QkDA8N/MjFB8JgCw/8TNp4EheQCulvgTWacgILakxgLKImTR8RYQG6Q/celb9QCGBgNIoJgNIgIApqXrv8HjQWPqV3YoQNPMi0BGe5Bhs8HKQAA5qOmsSMWnn4AAAAASUVORK5CYII="/> */}
      </div>
    </div>
  );
};

export default GetUser;