const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const goodreads = require("../lib/goodreads");
const aclibrary = require("../lib/aclibrary");

const app = express()
const port = 3000

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '../views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, '../views'))

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (request, response) => {
    response.render('home', {});
});

app.get("/gr/:userId", (req, resp) => {
    goodreads.listShelves(req.params.userId).then((list) => {
        resp.render("shelves", {
            userId: req.params.userId,
            shelves: list
        });
    }).catch((reason) => {
        if (reason.name == 'StatusCodeError') {
            if (reason.statusCode == 404) {
                resp.status(500).send("User not found");
            } else if (reason.statusCode == 500) {
                resp.status(500).send("Error talking to GoodReads");
            } else {
                resp.status(500).send("Unknown error talking to GoodReads");
                console.log("Unknown GoodReads error", reason);
            }
        } else {
            resp.status(500).send("Unknown error");
            console.log("Unknown error", reason);
        }
    });
});

app.get("/gr/:userId/:shelfName", (req, resp) => {
    goodreads.listShelf(req.params.userId, req.params.shelfName).then((list) => {
        resp.render("books", {
            userId: req.params.userId,
            shelf: req.params.shelfName,
            books: list
        });
    }).catch((reason) => {
        resp.status(500).send("Unknown error");
        console.log("Unknown error", reason);
    });
});

app.post("/fremont", (req, resp) => {
    var terms = req.body.terms;
    aclibrary.search(null, terms).then((result) => {
        resp.json({
            result: terms.map((x) => result.results[x])
        });
    }).catch((reason) => {
        resp.status(500).send("Unknown error");
        console.log("Unknown error", reason);
    });
});

// Static files (must be after all other handlers)
app.use('/', express.static(__dirname + '/../public', {
    maxAge: 365 * 24 * 60 * 60 * 1000,
}));

// Error handler (must be last)
app.use((err, request, response, next) => {
    // log the error, for now just console.log
    console.log(err)
    response.status(500).send('Something broke!')
})

// Turn on server
app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

  console.log(`server is listening on ${port}`)
})
