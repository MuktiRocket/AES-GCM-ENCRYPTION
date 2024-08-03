import React from "react";

const ShimmerTable = () => {
  const shimmerStyle = {
    position: "relative",
    height: "48px", // Match the row height
    backgroundColor: "#f4f4f4",
    overflow: "hidden",
  };

  const shimmerAnimationStyle = {
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 100%)",
    animation: "shimmer 1.5s infinite",
  };

  return (
    <>
      <style>
        {`
            @keyframes shimmer {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(100%); 
                }
            }
        `}
      </style>
      <tr style={shimmerStyle}>
        <td colSpan="2">
          <div style={shimmerAnimationStyle}></div>
        </td>
      </tr>
    </>
  );
};

export default ShimmerTable;
