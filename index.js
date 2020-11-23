const express = require('express');
const bodyParser = require('body-parser');
const { join } = require('path');

const userRoute = require('./routes/userRoutes');

// Importando as rotas
const app = express()
const port = 4444;

// Transformando o dado recebido em um object

app.use(bodyParser.urlencoded({ extended: false }))

userRoute(app)

app.get('/', (req, res) => {
    res.sendFile(
        join(__dirname + '/pages/index.html')
    )
});
app.listen(port, () => console.log('API rodando na porta 4444')); 

