import ConversionRates from "./ConversionRates ";
import DisputeResolution from "./DisputeResolution";

// components/Sidebar.tsx
const Sidebar = () => {
  return (
    <div className=""> {/* 40% of the viewport width */}
      {/* Dispute Section */}
      <div className="pb-2">
        <DisputeResolution/> 
      </div>

      {/* Conversion Rate Section */}
      <div className="pb-2">
      <ConversionRates/>
      </div>
    </div>
  );
};

export default Sidebar;
