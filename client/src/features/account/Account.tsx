import { useDispatch, useSelector } from "react-redux";
import { Button, ButtonGroup, Typography } from "@mui/material";

export default function Account() {
  // Root state shape based on your store:
  // { counter: { data: number } }
  const data = useSelector((state: { counter: { data: number } }) => state.counter.data);
  const dispatch = useDispatch();

  return (
    <>
      <Typography variant="h2">Account Page</Typography>
      <Typography variant="body1">Data: {data}</Typography>
      <ButtonGroup>
        <Button onClick={() => dispatch({ type: "increment" })}>Increment</Button>
        <Button onClick={() => dispatch({ type: "decrement" })}>Decrement</Button>
      </ButtonGroup>
    </>
  );
}
