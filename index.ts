import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3100, () => {
    console.log('Magazine hub - backend listening on port 3100!');
});
