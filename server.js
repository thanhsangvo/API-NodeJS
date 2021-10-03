const express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    log = require('morgan'),
    path = require('path'),
    cors = require('cors'),
    multer = require('multer'),
    // upload = multer(),
    app = express(),
    mongoose = require('mongoose'),
    Data = require('./nodeSchema'),

    PORT = process.env.PORT || 3000,
    NODE_ENV = process.env.NODE_ENV || 'development';

app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/DevSang', { useNewUrlParser: true })

mongoose.connection.once("open", () => {
    
    console.log("Connected to DB")

}).on("error", (error) => {
    console.log("Failed to connect " + error)
})

// Set EJS as templating engine
app.set("view engine", "ejs");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

app.get('/', (req, res) => {
    Data.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('imagesPage', { items: items });
        }
    });
});


app.post('/', upload.single('image'), (req, res) => {

    var obj = {
        name: req.body.name,
        old: req.body.old

    }

    Data.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(obj);

            item.save();
            res.redirect('/');
        }
    });
});


// Create
// Post request
app.post("/createuser", (req, res) => {

    var user = new Data ({

        name: req.get("name"),
        old: req.get("old")
    })

    user.save().then((error) => {

        if (user.isNew == false) {
                console.log(user)
                console.log("Saved data!")
                res.send("Saved data" + user)
        } else {
            console.log("Failed to saved data" + error)
        }
    })

})

app.get('/fetchuser', (req, res) => {
    Data.find({}).then((DBitems) => {
        res.send(DBitems)
    })
})


// // catch 404
// app.use((req, res, next) => {
//     log.error(`Error 404 on ${req.url}.`);
//     res.status(404).send({ status: 404, error: 'Not found' });
// });

// // catch errors
// app.use((err, req, res, next) => {
//     const status = err.status || 500;
//     const msg = err.error || err.message;
//     log.error(`Error ${status} (${msg}) on ${req.method} ${req.url} with payload ${req.body}.`);
//     res.status(status).send({ status, error: msg });
// });


app.listen(PORT, () => {
    console.log(
        `Express Server started on Port ${app.get(
            'port'
        )} | Environment : ${app.get('env')}`
    );
});


// // http://192.168.1.28:8081/create
// var server = app.listen(8081, '192.168.1.22', () => {
//     console.log("Server is running....!")
// })