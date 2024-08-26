const { addSchool, getAllSchools } = require('../models/schoolModel');

// Calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (Math.PI / 180) * angle;
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

const addSchoolHandler = (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Input validation
    if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const schoolData = { name, address, latitude: parseFloat(latitude), longitude: parseFloat(longitude) };

    addSchool(schoolData, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'School added successfully' });
    });
};

const listSchoolsHandler = (req, res) => {
    const { latitude, longitude } = req.query;

    if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    getAllSchools((err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        // Sort schools by distance from user's location
        const sortedSchools = results.map(school => ({
            ...school,
            distance: calculateDistance(userLat, userLon, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    });
};

module.exports = { addSchoolHandler, listSchoolsHandler };
