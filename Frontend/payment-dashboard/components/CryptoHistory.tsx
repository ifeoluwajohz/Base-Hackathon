// components/CryptoHistoryTable.tsx
import ReusableTable from './ReusableTable';

const cryptoHeaders = ["Transaction ID", "Transaction Type", "Amount", "Status", "Date"];
const cryptoHistoryData = [
  { transactionId: "001", type: "Deposit", amount: "0.8 BTC", status: "Completed", date: "2024-10-01" },
  { transactionId: "002", type: "Withdrawal", amount: "1.5 ETH", status: "Inprogress", date: "2024-10-05" },
];

const CryptoHistoryTable = () => {
  return <ReusableTable headers={cryptoHeaders} rows={cryptoHistoryData} />;
};

export default CryptoHistoryTable;
