import React, { useRef, useEffect } from "react";

const LogArea = ({ logs }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  return (
    <div className="log-area">
      {logs.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default LogArea;
