import MaxWidthWrapper from "./MaxWidthWrapper";

// components/CryptoBalance.tsx
const CryptoBalance = () => {
  return (
    
    <div className="bg-blue-500 text-white p-4 rounded-lg">
      {/* Flex container to align the elements in rows */}
      <div className="flex flex-col space-y-2">
        {/* Row 1: Cryptocurrency Balance */}
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Cryptocurrency Balance</h2>
          <p>1.2 ETH, 0.5 BTC</p>
        </div>

        {/* Row 2: Fiat Equivalent */}
        <div className="flex justify-between">
          <p>Fiat Equivalent</p>
          <p>$3,500</p>
        </div>

        {/* Row 3: NFT Balance */}
        <div className="flex justify-between">
          <p>NFT Balance</p>
          <p>3 NFTs</p>
        </div>
      </div>
    </div>
    
  );
};

export default CryptoBalance;
