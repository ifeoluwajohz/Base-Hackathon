// components/EscrowTable.tsx
import ReusableTable from './ReusableTable';

const escrowHeaders = ["Client/Role", "Milestone", "Amount", "Status", "Next Payment"];
const escrowData = [
  { client: "BWD Enterprise", milestone: "Milestone 1: Draft Delivery", amount: "2 ETH", status: "Inprogress", nextPayment: "0.5 ETH" },
  { client: "BWD Enterprise", milestone: "Milestone 2: Final Delivery", amount: "3 ETH", status: "Pending", nextPayment: "1 ETH" },
];

const EscrowTable = () => {
  return <ReusableTable headers={escrowHeaders} rows={escrowData} />;
};

export default EscrowTable;
