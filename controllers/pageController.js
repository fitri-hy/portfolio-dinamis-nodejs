const fs = require('fs');

exports.getHomePage = (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading JSON file');
        }
        
        try {
            const jsonData = JSON.parse(data);

            res.render('layout', { 
				jsonData: jsonData
            });
        } catch (parseErr) {
            console.error(parseErr);
            res.status(500).send('Error parsing JSON data');
        }
    });
};
