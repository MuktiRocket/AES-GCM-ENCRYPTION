import "./App.css";
import { useEffect, useState } from "react";
import { decrypt, fetchWithEncryption } from "./helper/commonHelper";
import Table from "./component/Table";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await fetchWithEncryption("http://localhost:5000/");
      setData(data);
    })();
  }, []);

  return (
    <div className="App">
      <h1 style={{ marginBottom: "20px" }}>AES GCM ENCRYPTION</h1>
      <Table data={data} />
    </div>
  );
}

export default App;
