'use client';
import { ReactElement } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
const NavLink = ({ icon, name }: { icon: any; name: string }) => {
  const pathname = usePathname();

  const activeClass =
    (pathname === '/pages' && name === 'feed') ||
    pathname === `/${name.toLowerCase()}`
      ? ' font-bold bg-[#F0F0F0]  dark:bg-[#F9FFE929] rounded-[13px]'
      : 'text-[#4C4C4C]';
  const activeTextClass =
    (pathname === '/pages' && name === 'feed') ||
    pathname === `/${name.toLowerCase()}`
      ? ' dark:text-white text-[#4C4C4C]  '
      : '';

  return (
    <motion.a
      href={name === 'feed' ? '/pages' : `/${name.toLowerCase()}`}
      className={`font-light flex gap-[12px] font-general_Sans rounded-[13px] dark:border-[rgba(255,255,255,0.13)]  !mt-0 items-center w-[25vh] lg:w-full p-[8px_8px] ${activeClass}`}
      whileHover={{
        backgroundColor: 'rgba(118, 116, 116, 1)',
        color: 'white',
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-[1.7rem] h-[36px] w-auto object-contain flex items-center justify-start">
        <div
      
          className=" object-cover"
       
              >
                  {icon}
                  </div>
      </span>
      <h4
        className={`text-[16px] text-white font-semibold flex gap-[8px] items-center ${activeTextClass}`}
      >
        {name}{' '}

      </h4>
    </motion.a>
  );
};

export default NavLink;