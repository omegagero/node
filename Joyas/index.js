const express = require('express');
const morgan = require('morgan');
const joyasRouter = require('./routes/joyas');

const app = express();
const port = 3000;

app.use(morgan('combined'));
app.use(express.json());

app.use('/joyas', joyasRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
