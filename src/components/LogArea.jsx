import React, { useRef, useEffect } from "react";
import { Box, Card, CardContent } from "@mui/material";

const LogArea = ({ logs }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  return (
    <Card className="log-area" sx={{}}>
      <CardContent
        sx={{
          overflowY: "auto",
          maxHeight: "200px",
          padding: "16px",
          backgroundColor: "grey.200",

          fontSize: "8pt",
          marginTop: "10px",
          backgroundColor: "black",
          color: "white",
        }}
      >
        {logs.map((log, index) => (
          <Box key={index} sx={{ marginBottom: "8px" }}>
            {log}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
    </Card>
  );
};

export default LogArea;
