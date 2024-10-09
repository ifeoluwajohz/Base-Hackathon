import React from 'react'
// import WalletSideBar from '~/components/navs/WalletSideBar';
// import WalletNav from '~/components/navs/WalletNav';
// import TrendingCard from '~/components/Feeds/TrendingCard';
// import AdsCard from '~/components/Feeds/AdsCard'; 
// import { ScrollArea } from '../ui/scroll-area';
// import ContainLayout from '../Container';
// import LayoutContainer from '../LayoutContainer';
import SideBar from '../Shared/Navs/SideBar';
import { ScrollArea } from '@radix-ui/react-scroll-area';
// import { ScrollArea } from '@radix-ui/react-scroll-area';


interface DefualtLayoutProps {
    children: React.ReactNode;
    
  
  }

const DashboardLayout = ({ children }: DefualtLayoutProps) => {
  return (
      <div className="max-h-screen min-h-screen   overflow-y-hidden w-full bg-[#FFFFFF]">

      {/* <WalletNav /> */}
  {/* <LayoutContainer > */}    
      <div className=" lg:pt-6 pt-4 px-10 w-full gap-10 flex flex-row justify-between ">

      <div className="lg:flex hidden  ">
      <ScrollArea className='h-[80vh] '>

     <div className='lg:flex hidden gap-y-6 flex-col'>
     <SideBar />

     </div>
      </ScrollArea>

        </div>


  <div className="   overflow-y-auto   w-full flex flex-col     border-[rgba(255,255,255,0.13)]  rounded-[12px]">
          {children}
 
        </div>
     
      </div>
      {/* </LayoutContainer> */}
    </div>
  );
};

export default DashboardLayout;