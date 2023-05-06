import React from "react";

const LogArea = ({ logs }) => {
  return (
    <div>
      <h3>Logs</h3>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default LogArea;
