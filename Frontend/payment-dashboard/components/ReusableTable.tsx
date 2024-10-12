import MaxWidthWrapper from "./MaxWidthWrapper";

// Define types for props
interface ReusableTableProps {
  headers: string[];  // Array of strings for headers
  rows: Array<{ [key: string]: string | number }>;  // Array of objects for rows, with dynamic keys and values
}

const ReusableTable: React.FC<ReusableTableProps> = ({ headers, rows }) => {
  return (
    
      <div className="">
        <table className=" w-full bg-blue-50 shadow-lg rounded-lg">
          {/* Dynamic Table Head */}
          <thead>
            <tr className="bg-blue-500 text-white rounded-t-lg w-full">
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3 text-left ${idx === 0 ? 'rounded-tl-lg' : ''} ${
                    idx === headers.length - 1 ? 'rounded-tr-lg' : ''
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className="bg-white hover:bg-blue-100 border-b border-gray-200"
              >
                {Object.values(row).map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-6 py-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
   
  );
};

export default ReusableTable;
 