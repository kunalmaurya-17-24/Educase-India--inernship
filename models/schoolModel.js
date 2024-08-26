const db = require('../config/db');

const addSchool = (schoolData, callback) => {
    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    const { name, address, latitude, longitude } = schoolData;
    db.query(query, [name, address, latitude, longitude], callback);
};

const getAllSchools = (callback) => {
    const query = 'SELECT * FROM schools';
    db.query(query, callback);
};

module.exports = { addSchool, getAllSchools };
