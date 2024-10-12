// pages/index.tsx
'use client'
import { useState } from "react";
import CryptoBalance from "@/components/CryptoBalance";
import EscrowServices from "@/components/EscrowServices";

import CryptoHistory from "@/components/CryptoHistory";
import NFTTransactions from "@/components/NFTTransactions";
import Sidebar from '@/components/Sidebar';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function Home() {
  const [activeSection, setActiveSection] = useState<"escrow" | "crypto" | "nft">("escrow");

  return (
   <MaxWidthWrapper>
     <div className="flex">
      
         {/* Main Content */}
      <div className=" p-10">
        
        {/* Static Crypto Balance at the Top */}
        <CryptoBalance />

        {/* Navigation buttons for Escrow, Crypto History, NFT */}
        <div className="flex mb-4 mt-4 space-x-4">
          <button
            onClick={() => setActiveSection("escrow")}
            className={`px-4 py-2 ${
              activeSection === "escrow" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600"
            } hover:text-blue-500`}
          >
            Escrow Services
          </button>
          <button
            onClick={() => setActiveSection("crypto")}
            className={`px-4 py-2 ${
              activeSection === "crypto" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600"
            } hover:text-blue-500`}
          >
            Cryptocurrency History
          </button>
          <button
            onClick={() => setActiveSection("nft")}
            className={`px-4 py-2 ${
              activeSection === "nft" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600"
            } hover:text-blue-500`}
          >
            NFT Transactions
          </button>
        </div>

        {/* Conditionally Render Based on Active Section */}
        {activeSection === "escrow" && <EscrowServices />}
        {activeSection === "crypto" && <CryptoHistory />}
        {activeSection === "nft" && <NFTTransactions />}
        
      </div>

      {/* Right Sidebar (Dispute and Conversion Rates) */}
      <div className="">
        <Sidebar />
      </div>
      
     

      </div>
   </MaxWidthWrapper>
      
  
  );
}
