// Start settings.

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const encryption = require('crypto');

const app = express();
const secret = 'QZWmxwXH8h1hN/g57/pOqg==';

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

let mysql = require('mysql');

function connectDB() {
    con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "test_db"
    });
}

// End settings.

// Functions

function defaultCheck(arg) {
    if (!arg.trim().length || arg.trim().length < 3 || arg == "undefined") {
        return false
    }
    else {
        return true;
    }
}

function encrypt(arg) {
    const hashedPassword = encryption.createHash('sha256').update(arg).digest('hex');
    return hashedPassword;
}

function authenticate(arg, arg1, arg2) {
    const username = String(arg);
    const password = String(arg1);
    const user_id = Number(arg2);

    const token = jwt.sign({ usr: username, pwd: password, usr_id: user_id }, secret, { expiresIn: '1h' });
    return token;
}

function verify(arg) {
    const req_token = arg;

    if (req_token != undefined && req_token != 0 && req_token.length > 150) {
        try {
            return jwt.verify(req_token, secret, (err, decode) => {
                if (err) {
                    console.log(err);
                    return 0;
                }
                return decode.usr_id;
            });
        } catch (err) {
            console.log(err);
            return 0;
        }
    }
    else {
        return 0;
    }
}

function getUniqueCollectionNames(arg) {
    const uniqueCollectionNames = new Set();

    for (const item of arg) {
        const collectionName = item.name;

        uniqueCollectionNames.add(collectionName);
    }
    return Array.from(uniqueCollectionNames);
}

function getDateToday() {
    const date = new Date();
    const year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// End functions

// Retrieving results for home page

app.get('/api/home', (req, res) => {
    connectDB();

    con.connect(function (err) {
        con.query(`SELECT id, front, back,
        (SELECT COUNT(*) from collections) as total_collections,
        (SELECT COUNT(*) from cards) as total_cards,
        (SELECT COUNT(*) from users) as total_users
         FROM cards WHERE is_public = 1 ORDER by id DESC LIMIT 50`, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.status(400).json(`api/home: Invalid request.`);
                con.end();
            }
            else {
                res.status(200).json(result);
                con.end();
            }
        });
    });
});

// Search

app.post('/api/search', (req, res) => {
    let search = String(req.body.search);

    connectDB();

    con.connect(function (err) {
        con.query(`SELECT cards.id as card_id, cards.front as card_name, collections.id as collection_id, collections.name as collection_name
     FROM cards INNER JOIN collections on collections.id=cards.collection_id
     WHERE cards.is_public = 1 AND (cards.front LIKE '%${search}%' OR collections.name LIKE '%${search}%') limit 10`, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.status(400).json(`api/search: Invalid request.`);
                con.end();
            }
            else {
                res.status(200).json(result);
                con.end();
            }
        });
    });

});

// Analytics sidebar

app.get('/api/analytics', (req, res) => {
    let token = req.headers.authorization;
    let user_id = verify(token);
    if (!token || token.lenght < 150 || !user_id) {
        res.status(401).json(`api/analytics: No access`);
    }
    else {

        connectDB();

        con.connect(function (err) {
            con.query(`select CASE
        WHEN vote = 1 THEN "yes"
        ELSE "no" END as votes, COUNT(*) as count from analytics where user_id = ${user_id} and date LIKE "${getDateToday()}%" group by votes`, function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(400).json(`api/analytics: Invalid request.`);
                    con.end();
                }
                else {
                    res.status(200).json(result);
                    con.end();
                }
            });
        });
    }
});

// ACCOUNT ANALYTICS

app.post('/api/account/analytics', (req, res) => {
    let token = req.headers.authorization;
    let collection_id = req.body.collection_id;

    let user_id = verify(token);
    if (!token || token.lenght < 150 || !user_id || !collection_id || collection_id <= 0 || isNaN(collection_id)) {
        res.status(401).json(`api/account/analytics: Bad request`);
    }
    else {

        connectDB();

        con.connect(function (err) {
            con.query(`select cards.id as card_id, cards.front as card_name, collections.name as collection_name,
            (SELECT COUNT(*) from analytics where analytics.card_id=cards.id and user_id = ${user_id}) as total_votes,
            (SELECT COUNT(*) from analytics where analytics.card_id=cards.id and user_id = ${user_id} AND vote = 1) as total_positive_votes
            from cards inner join collections on collections.id=cards.collection_id 
            where collections.id=${collection_id}`, function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(400).json(`api/account/analytics: Invalid request.`);
                    con.end();
                }
                else {
                    res.status(200).json(result);
                    con.end();
                }
            });
        });
    }
});


// Retrieving results for recommended collections

app.get('/api/recommended', (req, res) => {

    connectDB();

    con.connect(function (err) {
        con.query(`WITH temp AS
        (SELECT collection_id as count from cards WHERE is_public = 1 GROUP by collection_id ORDER by count(*) desc limit 8)
        SELECT collections.id, collections.name, COUNT(*) as count 
        FROM collections INNER JOIN cards on collections.id=cards.collection_id 
        where collections.id IN (SELECT * FROM temp) GROUP by collections.id, collections.name`, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.status(400).json(`api/recommended: Invalid request.`);
                con.end();
            }
            else {
                res.status(200).json(result);
                con.end();
            }
        });

    });
});

// Vote

app.post('/api/vote', (req, res) => {
    let card_id = Number(req.body.card_id);
    let vote = String(req.body.vote);
    let token = req.headers.authorization;
    let user_id = verify(token);
    if (vote == "yes") {
        vote = 1;
    }
    else if (vote == "no") {
        vote = 0;
    }
    else {
        vote = undefined;
    }

    if (!isNaN(card_id) && card_id >= 1 && token && token.length > 150 && user_id && (vote == 1 || vote == 0)) {

        connectDB();

        con.connect(function (err) {
            con.query(`INSERT INTO analytics (card_id, vote, user_id, date) VALUES(${card_id}, ${vote} ,${user_id}, NOW())`, function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(400).json(`api/vote: Invalid request.`);
                    con.end();
                }
                else {
                    console.log(result);
                    res.status(201).json(`success`);
                }
            });
        });

    }
    else {
        res.status(400).json(`api/vote: Bad request.`);
    }
});

// Retrieving results for collections

app.post('/api/collections', (req, res) => {
    let col_id = Number(req.body.col_id);
    let token = req.headers.authorization;
    let q;

    if (!isNaN(col_id) && col_id >= 0) {
        if (col_id == 0) {
            q = 'SELECT DISTINCT(collections.name), collections.id FROM collections INNER JOIN cards on cards.collection_id=collections.id WHERE cards.is_public = 1';
        }
        else {
            q = 'SELECT cards.front, cards.back, cards.id, cards.is_public, cards.user_id, collections.name as collection_name FROM cards INNER JOIN collections on collections.id=cards.collection_id WHERE collections.id = ' + col_id + ' ORDER By cards.is_public DESC';
        }
    }
    else {
        res.status(400).json(`api/collections: Invalid request.`);
        return;
    }

    connectDB();

    con.connect(function (err) {
        con.query(`${q}`, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.status(400).json(`api/collections: Invalid request.`);
                con.end();
            }
            else {
                if (col_id == 0) {
                    res.status(200).json(result);
                    con.end();
                }
                else {
                    if (result != 0) {
                        if (result[0].user_id == verify(token)) {
                            res.status(200).json(result);
                            con.end();
                        }
                        else {
                            for (let i = 0; i < result.length; i++) {
                                if (result[i].is_public == 0) {
                                    result.splice(i, result.length);
                                }

                            }
                            if (result != 0) {
                                res.status(200).json(result);
                                con.end();
                            }
                            else {
                                res.status(404).json(`api/collections: No results to display.`);
                                con.end();
                            }
                        }

                    }
                    else {
                        res.status(404).json(`api/collections: No results to display.`);
                        con.end();
                    }
                }
            }
        });
    });
});

// Retrieving results for specific card

app.post('/api/card', (req, res) => {

    let card_id = Number(req.body.card_id);
    const token = req.headers.authorization;

    if (isNaN(card_id) || card_id <= 0 || !card_id) {
        res.status(400).json(`api/card: Invalid request.`);
        return
    }
    else {

        connectDB();

        con.connect(function (err) {
            con.query(`SELECT cards.id, cards.front, cards.back, cards.is_public, cards.collection_id, cards.user_id, cards.date, collections.name, users.username 
            FROM cards INNER JOIN collections on cards.collection_id=collections.id 
            INNER JOIN users on cards.user_id=users.id
            WHERE cards.id = ${card_id}`, function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(400).json(`api/card: Invalid request.`);
                    con.end();
                }
                else {
                    if (result.length == 0) {
                        res.status(404).json(`api/card: No content to show.`);
                        con.end();
                        return;
                    }
                    else {
                        let usr_id = Number(verify(token));

                        if (result[0].user_id == usr_id || result[0].is_public == 1) {
                            res.status(200).json(result);
                            con.end();
                        }
                        else {
                            res.status(401).json(`api/card: No access.`);
                            con.end();
                        }
                    }
                }
            });
        });
    }
});

// Retrieving results for account

app.post('/api/account', (req, res) => {
    const token = req.headers.authorization;
    if (!token || token.length < 150) {
        res.status(401).json(`api/account: No access.`);
        return;
    }
    else {
        let user_id = verify(token);
        if (user_id == 0 || user_id == undefined) {
            res.status(401).json(`api/account: No access`);
        }

        else {
            connectDB();

            con.connect(function (err) {
                con.query(`SELECT migrations.id as migration_id, collections.id, collections.name, cards.id as card_id, cards.front, cards.back, cards.is_public, cards.collection_id, cards.user_id FROM cards RIGHT JOIN collections ON collections.id=cards.collection_id RIGHT JOIN migrations ON migrations.id=collections.migration_id WHERE cards.user_id = ${user_id} OR collections.user_id = ${user_id} ORDER by cards.id DESC`, function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.status(400).json(`api/account: Invalid request.`);
                        con.end();
                    }
                    else {
                        res.status(200).json(result);
                        con.end();
                    }
                });
            });
        }
    }
});

// Login  

app.post('/api/login', (req, res) => {
    let username = String(req.body.username);
    let password = String(req.body.password);
    if ((username == undefined || password == undefined) || (username.length < 3 || password.length < 3)) {
        res.status(422).json(`Please enter valid username & password.`);
        return;
    }
    else {
        const hashedPassword = encrypt(password);
        connectDB();
        con.connect(function (err) {
            con.query(`SELECT id FROM users WHERE username = "${username}" AND password = "${hashedPassword}" `, function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(400).json(`api/login: Invalid request.`);
                    con.end();
                }
                else {
                    if (result != "") {
                        res.status(200).json(authenticate(username, hashedPassword, result[0].id));
                        con.end();
                    }
                    else {
                        res.status(401).json(`Wrong username or password. Please retry.`);
                        con.end();
                    }
                }
            });
        });
    }
});


// Insert 

app.post('/api/insert', (req, res) => {

    const token = req.headers.authorization;

    if (!token || token.length < 150) {
        res.status(401).json(`api/insert: No access.`);
    }
    else {
        let user_id = verify(token);

        if (user_id == 0 || user_id == undefined) {
            res.status(401).json(`api/insert: No access`);
        }

        else {
            if (req.body.collection_name && defaultCheck(`${req.body.collection_name}`)) {
                let collection_name = String(req.body.collection_name);

                connectDB();

                con.connect(function (err) {
                    con.query(`INSERT INTO collections (name, user_id) VALUES("${collection_name}", ${user_id})`, function (err, result, fields) {
                        if (err) {
                            console.log(err);
                            res.status(400).json(`api/insert: Invalid request.`);
                            con.end();
                        }
                        else {
                            if (result != "") {
                                res.status(201).json("success");
                                con.end();
                            }
                            else {
                                res.status(422).json(`Unable to create new collection.`);
                                con.end();
                            }
                        }
                    });
                });

            }
            else {

                let front = String(req.body.front);
                let back = String(req.body.back);
                let is_public = Number(req.body.is_public);
                let collection_id = Number(req.body.collection_id);

                if (!defaultCheck(`${front}`) || !defaultCheck(`${back}`) || (is_public != 1 && is_public != 0) || (!collection_id || isNaN(collection_id) || collection_id <= 0)) {
                    console.log(`api/insert: Error inserting card.`);
                    res.status(400).json(`api/insert: Invalid request.`);
                    return;
                }
                else {

                    connectDB();

                    con.connect(function (err) {
                        con.query(`INSERT INTO cards (front, back, is_public, collection_id, user_id) VALUES("${front}", "${back}", ${is_public}, ${collection_id}, ${user_id})`, function (err, result, fields) {
                            if (err) {
                                console.log(err);
                                res.status(400).json(`api/insert: Invalid request.`);
                                con.end();
                            }
                            else {
                                if (result != "") {
                                    res.status(201).json("success");
                                    con.end();
                                }
                                else {
                                    res.status(422).json(`Unable to create new card.`);
                                    con.end();
                                }
                            }
                        });
                    });
                }
            }
        }
    }
});

// Edit  

app.patch('/api/update', (req, res) => {
    let type = String(req.body.type);
    let id = Number(req.body.id);
    let token = req.headers.authorization;
    let proceed = 0;

    if (!token || token.length < 150) {
        res.status(401).json(`api/update: No access.`);
    }
    else {
        let user_id = verify(token);
        if (user_id == 0 || user_id == undefined) {
            res.status(401).json(`api/update: No access`);
        }

        else {
            let q;

            if (type == "card" && !isNaN(id) && id >= 1 && req.body.front && req.body.back && defaultCheck(`${req.body.front}`) && defaultCheck(`${req.body.back}`)) {
                proceed = 1;
                let front = String(req.body.front);
                let back = String(req.body.back);
                q = `UPDATE cards SET front = "${front}", back = "${back}" WHERE id = ${id} and user_id = ${user_id}`;
            }
            else if (type == "collection" && !isNaN(id) && id >= 1 && req.body.name && defaultCheck(`${req.body.name}`)) {
                proceed = 1;
                let name = String(req.body.name);
                q = `UPDATE collections SET name = "${name}" WHERE id = ${id} and user_id = ${user_id}`;
            }
            if (proceed == 0) {
                res.status(422).json(`Please enter valid values before proceeding.`);
            }
            else {
                connectDB();

                con.connect(function (err) {
                    con.query(`${q}`, function (err, result, fields) {
                        if (err) {
                            console.log(err);
                            res.status(400).json(`api/update: Invalid request.`);
                            con.end();
                        }
                        else {
                            if (result != "" && result.affectedRows > 0) {
                                res.status(201).json("success");
                                con.end();
                            }
                            else {
                                res.status(422).json(`api/update: Unable to update record.`);
                                con.end();
                            }
                        }
                    });
                });
            }
        }
    }
});

// Delete

app.delete('/api/delete/:type/:id', (req, res) => {
    const id = Number(req.params.id);
    const type = String(req.params.type);
    const token = req.headers.authorization;

    if (!token || token.length < 150) {
        res.status(401).json(`api/delete: No access.`);
    }

    else if (isNaN(id) || id <= 0) {
        res.status(400).json(`api/delete: Invalid request.`);
    }
    else {
        let user_id = verify(token);

        if (user_id == 0 || user_id == undefined) {
            res.status(401).json(`api/delete: No access`);
        }

        else {
            let q;

            if (type == "card") {
                q = `DELETE FROM cards where id = ${id} AND user_id = ${user_id}`;
            }
            else if (type == "collection") {
                q = `DELETE FROM collections where id = ${id} AND user_id = ${user_id}`;
            }
            else if (type == "migration") {
                q = `DELETE FROM migrations where id = ${id} AND user_id = ${user_id}`;
            }
            else if (type == "user") {
                q = `DELETE FROM users where id = ${user_id}`;
            }
            else {
                res.status(400).json(`api/delete: Invalid request.`);
                return;
            }

            connectDB();
            con.connect(function (err) {
                con.query(`${q}`, function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.status(400).json(`api/delete: Invalid request.`);
                        con.end();
                    }
                    else {
                        if (result.affectedRows >= 1) {
                            res.status(201).json("success");
                        }
                        else {
                            res.status(400).json(`api/delete: Invalid request.`);
                        }
                        con.end();
                    }
                });
            });
        }
    }
});

// Register  

app.post('/api/register', (req, res) => {

    let username = String((req.body.username).toLowerCase());
    let password = String(req.body.password);
    let validation = 0;
    let responseError;

    let regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/; // 8-30 characters, lowercase, uppercase, symbol, number.
    let regexUsername = /^[a-zA-Z][a-zA-Z0-9_]{2,20}$/; // 3-20 characters, uppercase, lowercase, underscore, must start with letter.

    if (password == username && username) {
        if (!responseError) {
            responseError = "Username and password can't be equal.";
        }
    } else { validation += 1; }

    if (!username || !password) {
        if (!responseError) {
            responseError = "Fields cannot be empty.";
        }
    } else { validation += 1; }

    if (!regexUsername.test(username)) {
        if (!responseError) {
            responseError = "Username must be at least 3 characters long, must start with letter and can have underscore.";
        }
    } else { validation += 1; }

    if (!regexPassword.test(password)) {
        if (!responseError) {
            responseError = "Password must be at least 12 characters long and be a combination of lowercase, uppercase, symbol and number.";
        }
    } else { validation += 1; }

    if (validation == 4) {

        const hashedPassword = encrypt(password);

        connectDB();

        con.connect(function (err) {
            con.query(`SELECT username from users WHERE username = "${username}"`, function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(400).json(`api/register: Invalid request.`);
                    con.end();
                }
                else {
                    if (result != null && result != undefined && result != 0) {
                        res.status(422).json(`Username already registered.`);
                        con.end();
                    }
                    else {
                        con.query(`INSERT INTO users (username, password, date) VALUES("${username}", "${hashedPassword}", NOW())`, function (err, result, fields) {
                            if (err) {
                                console.log(err);
                                res.status(400).json(`api/register: Invalid request.`);
                                con.end();
                            }
                            else {
                                if (result != "") {
                                    res.status(201).json("success");
                                    con.end();
                                }
                                else {
                                    res.status(422).json(`Registration unsuccessful. Please contact support.`);
                                    con.end();
                                }
                            }
                        });
                    }
                }
            });
        });
    }
    else {
        res.status(422).json(responseError);
    }
});

// Migration endpoint

app.post('/api/migration', (req, res) => {
    const token = req.headers.authorization;
    const api_key = req.body.api_key;
    const account = req.body.account;
    let id = 38;

    if (account == "test2") {
        id = 39;
    }

    if (!token || token.length < 150 || api_key != "test") {
        res.status(401).json(`api/migration: No access.`);
        return;
    }
    else {
        let user_id = verify(token);
        if (user_id == 0 || user_id == undefined) {
            res.status(401).json(`api/migration: No access`);
        }

        else {

            connectDB();

            con.connect(function (err) {
                con.query(`SELECT c.id, c.front, c.back, c.is_public, c.collection_id, co.name FROM cards c INNER JOIN collections co ON co.id=c.collection_id WHERE c.user_id = ${id} ORDER by c.id DESC`, function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.status(400).json(`api/migration: Invalid request.`);
                        con.end();
                    }
                    else {
                        res.status(200).json(result);
                        con.end();
                    }
                });
            });
        }
    }

});

// Migration insert

app.post('/api/migration/insert', (req, res) => {

    const token = req.headers.authorization;
    let data = req.body.data;
    let is_public = req.body.is_public;
    let collection_settings = req.body.collection;
    let uniqueCollections = getUniqueCollectionNames(data)

    if (!token || token.length < 150) {
        res.status(401).json(`api/migration/insert: No access.`);
    }
    else {
        let user_id = verify(token);

        if (user_id == 0 || user_id == undefined) {
            res.status(401).json(`api/migration/insert: No access`);
        }

        else if (!data || data.length == 0 || !defaultCheck(`${data[0].front}`) || !defaultCheck(`${data[0].front}`) || !is_public || (is_public != 0 && is_public != 1 && is_public != 2) || (collection_settings != 0 && collection_settings != 1) || !collection_settings) {
            res.status(422).json(`api/migration/insert: Invalid request.`);
            return;
        }
        else {
            let migration_id = encrypt(JSON.stringify(data));
            // Check if exactly same migration was submitted.
            connectDB();

            con.connect(function (err) {
                con.query(`INSERT INTO migrations (migration_id, user_id) VALUES("${migration_id}", ${user_id})`, function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.status(422).json(`This migration was already submitted.`);
                        con.end();
                    }
                    else {
                        if (result != "") {
                            // Migration duplicate checks passed.
                            // Retrieving the migration_id

                            con.query(`SELECT id FROM migrations WHERE migration_id = "${migration_id}"`, function (err, result, fields) {
                                if (err) {
                                    console.log(err);
                                    res.status(400).json(`api/migration/insert: Invalid request.`);
                                    con.end();
                                }
                                else {

                                    // Inserting the unique collections.
                                    let values;
                                    let inserted_names;
                                    if (collection_settings == 0) {
                                        values = `("Migration_${getDateToday()}", ${user_id}, ${result[0].id}, NOW())`;
                                    }
                                    else {
                                        values = `("${uniqueCollections[0]}", ${user_id}, ${result[0].id}, NOW())`;
                                        for (let i = 1; i < uniqueCollections.length; i++) {
                                            values += `, ("${uniqueCollections[i]}", ${user_id}, ${result[0].id}, NOW())`;
                                        }
                                    }
                                    connectDB();
                                    con.connect(function (err) {
                                        con.query(`INSERT INTO collections (name, user_id, migration_id, date) VALUES ${values}`, function (err, result, fields) {
                                            if (err) {
                                                console.log(err);
                                                res.status(400).json(`api/migration/insert: Invalid request.`);
                                                con.end();
                                            }
                                            else {
                                                if (result != "") {
                                                    // Retrieving the new ID's after collections are inserted successfully.
                                                    if (collection_settings == 0) {
                                                        inserted_names = `"Migration_${getDateToday()}"`;
                                                    }
                                                    else {
                                                        inserted_names = `"${uniqueCollections[0]}"`;
                                                        for (let i = 1; i < uniqueCollections.length; i++) {
                                                            inserted_names += `, "${uniqueCollections[i]}"`;
                                                        }
                                                    }
                                                    con.query(`SELECT id, name FROM collections WHERE name IN(${inserted_names}) and user_id = ${user_id} AND date LIKE "${getDateToday()}%"`, function (err, result, fields) {
                                                        if (err) {
                                                            console.log(err);
                                                            res.status(400).json(`api/migration/insert: Invalid request.`);
                                                            con.end();
                                                        }
                                                        else {
                                                            // Preparing cards for inserting after successfully retrieving the new collection ID's.
                                                            if (collection_settings == 0) {
                                                                for (let m = 0; m < data.length; m++) {
                                                                    data[m].collection_id = result[0].id;
                                                                }
                                                            }
                                                            else {
                                                                for (let j = 0; j < data.length; j++) {
                                                                    for (let l = 0; l < result.length; l++) {
                                                                        if (data[j].name == result[l].name) {
                                                                            data[j].collection_id = result[l].id;
                                                                        }
                                                                    }
                                                                }
                                                            }

                                                            if (is_public == 1 || is_public == 0) {
                                                                for (let y = 0; y < data.length; y++) {
                                                                    data[y].is_public = is_public;
                                                                }
                                                            }

                                                            // Cards data prepared, proceeding with inserting.
                                                            let card_values = `("${data[0].front}", "${data[0].back}", ${data[0].is_public}, ${data[0].collection_id}, ${user_id}, 1)`;
                                                            for (let z = 1; z < data.length; z++) {
                                                                card_values += `, ("${data[z].front}", "${data[z].back}", ${data[z].is_public}, ${data[z].collection_id}, ${user_id}, 1)`;
                                                            }

                                                            con.query(`INSERT INTO cards (front, back, is_public, collection_id, user_id, is_migrated) VALUES ${card_values}`, function (err, result, fields) {
                                                                if (err) {
                                                                    console.log(err);
                                                                    res.status(400).json(`api/migration/insert: Invalid request.`);
                                                                    con.end();
                                                                }
                                                                else {
                                                                    if (result != "") {
                                                                        res.status(201).json("success");
                                                                        con.end();
                                                                    }
                                                                    else {
                                                                        res.status(422).json(`Inserting new cards unsuccessful.`);
                                                                        con.end();
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                                else {
                                                    res.status(422).json(`Inserting new collections unsuccessful.`);
                                                    con.end();
                                                }
                                            }
                                        });
                                    });

                                }
                            });
                        }
                        else {
                            res.status(422).json(`Unable to retrieve migrations.`);
                            con.end();

                        }
                    }
                });
            });
        }
    }
});
