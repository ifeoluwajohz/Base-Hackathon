// components/DisputeResolution.tsx
const DisputeResolution = () => {
  return (
    <div className="mb-4 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Dispute Resolution</h2>
      <table className="w-full mt-2 bg-blue-50">
        <thead className="bg-white hover:bg-blue-100 border-b border-gray-200">
          <tr>
            <th className="p-2">Job</th>
            <th className="p-2">Amount in Escrow</th>
            <th className="p-2">Dispute Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white hover:bg-blue-100 border-b border-gray-200">
            <td className="p-2">Web Developer for BWD Enterprise</td>
            <td className="p-2">0.5 ETH</td>
            <td className="p-2 text-red-500">Open</td>
          </tr>
          <tr  className="bg-white hover:bg-blue-100 border-b border-gray-200">
            <td className="p-2">Web Developer for BWD Enterprise</td>
            <td className="p-2">0.5 ETH</td>
            <td className="p-2 text-green-500">Closed</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DisputeResolution;
