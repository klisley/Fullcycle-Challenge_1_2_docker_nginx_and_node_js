const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const mysql = require('mysql')
const fs = require('fs');

const connection = mysql.createConnection(config)

// Mysql connection check
connection.connect(function(error) {
    if (error) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Database Connected');
});

function insertRandomName(res, callback) {
    fs.readFile('nomes.txt', 'utf8', function(error, data) {
        if (error) {
            console.error('Error reading file: ' + err.stack);
            return;
        }
        const names = data.split('\n');
        const randomName = names[Math.floor(Math.random() * names.length)].trim();
        const sql = `INSERT INTO people(name) VALUES('${randomName}')`;

        connection.query(sql, function (error) {
            if (error) {
                console.error('Query error: ' + error.stack);
                return;
            }
            console.log(`Inserted ${randomName}`);
        });
        callback(res);
    });
}

function getPeopleTable(res) {
    connection.query('SELECT * FROM people', function (error, results) {
        if (error) {
            res.send('Error fetching data: ' + error.stack);
            return;
        }

        let html = '<h1>Full Cycle Rocks!</h1>';
        html += '<h3>Lista de nomes cadastrada no banco de dados</h3>';
        html += '<table border="1"><tr><th>ID</th><th>Name</th></tr>';
        results.forEach(function(row) {
            html += `<tr><td>${row.id}</td><td>${row.name}</td></tr>`;
        });
        html += '</table>';
        html += '<p>Curiosidade: Essa lista corresponde aos 50 nomes mais populares do Brasil em 2011</p>';
        html += '<p>A cada vez que você acessa a página, um novo nome aparece. A ordem é aleatória e o nome pode se repetir.</p>';
        res.send(html);
    });

}

app.get('/', (req,res) => {
    insertRandomName(res, function() {
        getPeopleTable(res); 
    });
})

app.listen(port, () => {
    console.log('Running on port ' + port)
})