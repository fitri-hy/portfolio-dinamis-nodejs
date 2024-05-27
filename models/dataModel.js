const fs = require('fs').promises;
const path = require('path');
const dataPath = path.resolve(__dirname, '../data.json');

const getData = async () => {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return null;
        }
        throw err;
    }
};

const saveData = async (jsonData) => {
    try {
        await fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), 'utf8');
    } catch (err) {
        throw err;
    }
};

module.exports = {
    getData,
    saveData
};
