
// Importando arquivos importantes 

const { Console } = require('console');
const fs = require('fs');
const { join, resolve,} = require('path');
// Criando o arquivo de filePath

filePath = join(__dirname, 'users.json');

central = resolve("./")

fileLogAccess = join(central + "\\logs\\", 'access.log');

// Definindo const para armazenar os values

const date = new Date()
const data_users = {
    name: '',
    id: '',
    email: ''
}

// Criando métodos para buscar os usuários

const foundEmail = (listEmails) => {

    var parse_email = /^[a-zA-Z0-9][a-zA-Z0-9\._-]+@([a-zA-Z0-9\._-]+\.)[a-zA-Z-0-9]{2,3}/;

    if(parse_email.test(listEmails)){
        return true;
    }
    return false;

}

const getUser = () => {
    const data = fs.existsSync(filePath)
        ? fs.readFileSync(filePath)
        : []

    try {
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

// Criando método responsável por salvar os dados de users

const saveUser = (users, method) => {
    fs.writeFileSync(filePath, JSON.stringify(users, null, '\t'))
}

const saveAccess = (log, method) => {

    log = "|" + date.toString() + " " + method + ", [Action: " + log + "]\n"
    
    fs.writeFileSync
        (   
            fileLogAccess, 
            log,
            {encoding: 'utf-8', flag:'a+'}
        )
}
// Criando as rotas com os métodos POST, PUT, DELETE e GET

const userRoute = (app) => {
    app.route('/users/:id?')
        
        // Criando a primeira rota GET

        .get((req, res) => {
            const users = getUser();

            saveAccess("request(s) the users.", "GET")

            res.status(200).send({ 
                Information: "List full of users",
                users
             })
        })

        .post((req, res) => {
            const users = getUser();
            
            const { name, email} = req.body;

            data_users['email'] = email;
            data_users['name'] = name;
            data_users['id'] = Object.keys(users).length + 1;
            
            if(foundEmail(email) == true){
                users.push(data_users);

                saveUser(users);

                saveAccess("created new user: " + name + ".", "POST")

                res.status(200).send('User Created!');
            }else{
                saveAccess("failed to created new user: " + name + ".", "POST")

                res.status(400).send(
                    "Por favor insira um e-mail válido!"
                )
            }
        })

        .put((req, res) => {
            const users = getUser();

            const { email, name } = req.body;

            if(foundEmail(email) == true){
                saveUser(users.map(user => {
                    if(user.id === parseInt(req.params.id)){
                        return {
                            ...user,
                            ...req.body
                        }
                    } 
    
                    return user;
                }));
                
                saveAccess("updated the user: " + name + ".", "PUT");

                res.status(200).send('User Created!');
            }else{
                saveAccess("failed to updated the user: " + name + ".", "PUT");

                res.status(400).send(
                    "Por favor insira um e-mail válido!"
                );
            }
        })

        .delete((req, res) => {
            const users = getUser();

            saveUser(users.filter(user => user.id !== parseInt(req.params.id)));

            saveAccess("deleted the user", "DELETE");

            res.status(200).send('User deleted!');
        })
}

module.exports = userRoute