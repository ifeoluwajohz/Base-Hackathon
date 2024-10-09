import Image from 'next/image'
import React from 'react'
import DashboardLayout from '~/~/components/Layout/DashboardLayout'
import shape from '~/~/public/Images/shape.png'

const page = () => {
  return (
      <div>
          <DashboardLayout>
              <div className='flex flex-col gap-4'>
                  <h1 className='text-2xl md:text-5xl  font-semibold leading-9'>Discover</h1>
                  <ShapeWithClipPath />
                </div>
</DashboardLayout>
    </div>
  )
}

export default page


const ShapeWithClipPath = () => {
  return (
      <div className="relative">
              <div className="relative w-full h-[350px] bg-blue-600 rounded-lg overflow-hidden">
      {/* Clip path for the bottom cut-out */}
      <div
        className="absolute bottom-0 left-0 w-full h-full bg-blue-600"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 60% 100%, 50% 85%, 40% 100%, 0 100%)",
        }}
      ></div>

      {/* Grid-like overlay (optional) */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 gap-2">
        {Array(18)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="bg-blue-500 opacity-75 h-full w-full"></div>
          ))}
      </div>
       
      {/* Small white dot */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white"></div>
      </div>
         <div className='absolute -top-10 -right-0'>
              <Image src='/Images/Illustration.png' alt='' width={276} height={240} className='w-[276px ] h-[240px] md:w-full md:h-full' />
          </div>
         <div className='absolute bottom-10 left-10'>
              <div className='max-w-[180px] md:max-w-[250px]'>
                  <h1 className='text-base md:text-4xl text-white font-semibold leading-8 md:leading-[60px]'>Get your next 
WEB3 Job</h1>
            </div>
          </div>
</div>
  );
};

