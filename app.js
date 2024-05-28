const express = require('express');
const path = require('path');
const compression = require('compression');
const cacheHeaders = require('express-cache-headers');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const pageRoutes = require('./routes/pageRoutes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression({ level: 9 }));
app.use(cacheHeaders({
    cacheControl: {
        public: true,
        maxAge: 60 * 60 * 24 * 7,
        mustRevalidate: true
    },
    expires: {
        maxAge: 60 * 60 * 24 * 7
    }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use('/', pageRoutes);
app.use((req, res, next) => {
	fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading JSON file');
        }
        
        try {
            const jsonData = JSON.parse(data);

            res.status(404).render('404', { 
				jsonData: jsonData
            });
        } catch (parseErr) {
            console.error(parseErr);
            res.status(500).send('Error parsing JSON data');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
