import app from "./app";

const port: string | undefined = process.env.PORT;

app.listen(port, () => console.log(`Express server running at ${port}`));
