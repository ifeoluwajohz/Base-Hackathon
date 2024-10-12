// components/NFTTransactionsTable.tsx
import ReusableTable from './ReusableTable';

const nftHeaders = ["Artwork ID", "Transaction Type", "Quantity", "Status", "Date"];
const nftTransactionsData = [
  { artworkId: "#456", type: "Purchase", quantity: "3 NFTs", status: "Completed", date: "2024-09-15" },
  { artworkId: "#789", type: "Sale", quantity: "1 NFT", status: "Pending", date: "2024-09-25" },
];

const NFTTransactionsTable = () => {
  return <ReusableTable headers={nftHeaders} rows={nftTransactionsData} />;
};

export default NFTTransactionsTable;
