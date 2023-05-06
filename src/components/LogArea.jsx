import React from "react";

const LogArea = ({ logs }) => {
  return (
    <div className="log-area">
      <h3>Logs</h3>
      <ul className="log">
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default LogArea;
