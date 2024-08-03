import React, { useState } from "react";
import ShimmerTable from "./ShimmerTable";
import { decrypt, encrypt, fetchWithEncryption } from "../helper/commonHelper";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
};

const spanStyle = {
  color: "green",
  fontSize: "18px",
  marginBottom: "10px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};

const trStyle = {
  backgroundColor: "white",
};

const Table = ({ data }) => {
  const [response, setResponse] = useState(null);

  const handleClick = async (name) => {
    const data = {
      name,
    };
    const payload = await encrypt(JSON.stringify(data));
    try {
      const { data } = await fetchWithEncryption("http://localhost:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      setResponse(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={containerStyle}>
      <span style={spanStyle}>{response?.message}</span>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Age</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((row, index) => (
              <tr
                key={index}
                style={trStyle}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9f9f9")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <td style={tdStyle}>{row.name}</td>
                <td style={tdStyle}>{row.age}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleClick(row.name)}>Act</button>
                </td>
              </tr>
            ))}

          {data.length == 0 &&
            Array.from({ length: 5 }).map((_, index) => (
              <ShimmerTable key={index} />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
