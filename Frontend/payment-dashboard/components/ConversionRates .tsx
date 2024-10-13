// components/ConversionRates.tsx
const ConversionRates = () => {
  return (
    <div className="bg-blue-100 p-4 rounded-lg">
      <h2 className="text-lg font-semibold">Real-time Conversion Rates</h2>
      <table className="w-full mt-2 bg-blue-50">
        <thead>
          <tr>
            <th className="p-2">Crypto</th>
            <th className="p-2">Conversion Rate (USD)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2">ETH</td>
            <td className="p-2">$3,200</td>
          </tr>
          <tr>
            <td className="p-2">BTC</td>
            <td className="p-2">$30,000</td>
          </tr>
          <tr>
            <td className="p-2">SOL</td>
            <td className="p-2">$150</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ConversionRates;
