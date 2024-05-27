const express = require('express');
const path = require('path');
const compression = require('compression');
const cacheHeaders = require('express-cache-headers');
const sharp = require('sharp');
const fs = require('fs');
const app = express();
const pageRoutes = require('./routes/pageRoutes');

const convertToWebP = (req, res, next) => {
    const publicDir = path.join(__dirname, 'public');
    const filePath = path.join(publicDir, req.url);
    const ext = path.extname(filePath);
    const imageDirectories = ['images/logo', 'images/uploads'];
    const isImage = imageDirectories.some((dir) => req.url.startsWith(`/${dir}`));

    if (isImage && (ext === '.jpg' || ext === '.jpeg' || ext === '.png')) {
        const webpFilePath = filePath.replace(/\.(jpg|jpeg|png)$/, '.webp');

        fs.access(webpFilePath, fs.constants.F_OK, (err) => {
            if (!err) {
                res.type('image/webp').sendFile(webpFilePath);
            } else {
                sharp(filePath)
                    .webp({ quality: 80 })
                    .toFile(webpFilePath, (err) => {
                        if (err) {
                            console.error('Error converting image to WebP:', err);
                            return next();
                        }
                        res.type('image/webp').sendFile(webpFilePath);
                    });
            }
        });
    } else {
        next();
    }
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(convertToWebP);
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
