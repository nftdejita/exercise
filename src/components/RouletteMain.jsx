import {
  Button,
  Input,
  TextField,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const RouletteMain = () => {
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
          Roulette
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RouletteMain;
