const { request } = require('express');
const express = require('express');
const morgan = require('morgan');
const app = express();

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(
    morgan(
        ':method :url :status :response-time ms - :body',
        {
            skip: (req, res) => req.method !== 'POST'
        }
    )
);

let persons = [
    {
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1
    },
    {
        name: 'Ada Lovelace',
        number: '39-44-5323523',
        id: 2
    },
    {
        name: 'Dan Abramov',
        number: '12-43-234345',
        id: 3
    }
];


app.get('/api/persons', (request, response) => {
    response.json(persons);
});

const idGenerator = (person) => {
    let id = 0;
    let range = persons.length * 10;

    do {
        id = Math.round(Math.random() * range);
    }
    while (persons.find(p => p.id === id))

    return {
        ...person,
        id
    };
};

const postValidator = (body) => {
    if (
        !body || 
        !body.name || 
        !body.number
    ) {
        return 'Missing informations';
    } else if ((persons || []).find(p => p.name === body.name)) {
        return 'name must be unique';
    }
    return null;
};

app.post('/api/persons', (request, response) => {
    const error = postValidator(request.body);
    if (error) {
        response.status(400).json({ error }).send();
    } else {
        const newPerson = idGenerator(request.body);
        persons = persons.concat(newPerson);
        response.json(newPerson);
    }
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    if (!found) {
        response.status(404).send();
    } else {
        response.json(found);
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const updated = persons.filter(p => p.id !== id);
    if (updated.length === persons.length) {
        response.status(404).send();
    } else {
        persons = updated;
        response.status(204).send();
    }
});


app.get('/info', (request, response) => {
    response.contentType('html');
    response.send(`
        <p>Phonebook has info for ${(persons || []).length} people</p>

        <p>${new Date()}</p>
    `);
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});