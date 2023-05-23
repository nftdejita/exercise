import {
  Button,
  Input,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const OnePonziMain = () => {
  return (
    <Card sx={{ margin: "6px" }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h4" color="inherit" noWrap>
          OnePonzi
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OnePonziMain;
