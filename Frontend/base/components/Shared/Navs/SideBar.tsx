'use client';
// Import necessary modules
'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
// import NavLink from '../NavLink/NavLink';
// import NotificationIcon from '~/components/ui/icons/NotificationIcon';
import FeedsIcon from '~/public/icons/FeedsIcon.svg';
import Avatars from '~/public/icons/Avatars.svg';
import Transfer from '~/~/public/Icons/Transfer';
import Wallet from '~/~/public/Icons/Wallet';
import Wa from '~/~/public/Icons/Wa';
import Profile from '~/~/public/Icons/Profile';
import NavLink from './NavLink';
// import { useUserStore } from '~/app/Store/slices/userSlice';

// Define the component
const SideBar = () => {
//   const { user, fetchUser } = useUserStore((state) => ({
//     user: state.user,
//     fetchUser: state.fetchUser
//   }));

//   useEffect(() => {
//     fetchUser();
//   }, [fetchUser]);
  return (
    <div className=" left-[-100%]  lg:left-0 h-fit  rounded-[12px] bg-[#0648D7]  text-white min-w-[273px] w-[273px] max-w-[273px] top-0  fixed lg:relative lg:flex hidden flex-col justify-between p-[25px_19px] z-20">
      <div className="flex flex-col grow gap-[22px] items-center ">
 

        <div className="flex flex-col w-full  gap-[25px]">
          {links.slice(0, 6).map((link, index) => (
            <NavLink name={link.name} icon={link.icon} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;

const links = [
  {
    name: 'Feeds',
    icon: <Wallet />
  },
  {
    name: 'Wallet',
    icon: <Wa />
  },
  {
    name: 'Transfer',
    icon: <Transfer />
  },
  {
    name: 'Profile',
    icon: <Profile />
  }
  // {
  //   name: 'Ads',
  //   icon: AdsIcon
  // }
];