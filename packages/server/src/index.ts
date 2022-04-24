import app from 'app';

app.listen(process.env.EXPRESS_PORT, () =>
  console.log(`Listening: http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`)
);
