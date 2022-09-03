import app from './app';

app.listen(process.env.EXPRESS_PORT, () =>
  console.log(
    `Listening: ${process.env.EXPRESS_PROTOCOL || 'http'}://${process.env.EXPRESS_HOST}:${
      process.env.EXPRESS_PORT
    }`
  )
);
