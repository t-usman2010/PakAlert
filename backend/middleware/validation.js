// validation.js
const validateReport = (req, res, next) => {
    const { city, description, severity } = req.body;
    
    if (!city || !description || !severity) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            required: ['city', 'description', 'severity']
        });
    }

    if (typeof city !== 'string' || city.length < 2) {
        return res.status(400).json({
            error: 'Invalid city name',
            details: 'City name must be at least 2 characters long'
        });
    }

    if (typeof description !== 'string' || description.length < 10) {
        return res.status(400).json({
            error: 'Invalid description',
            details: 'Description must be at least 10 characters long'
        });
    }

    if (!['low', 'medium', 'high'].includes(severity.toLowerCase())) {
        return res.status(400).json({
            error: 'Invalid severity level',
            allowed: ['low', 'medium', 'high']
        });
    }

    next();
};

const validateAlert = (req, res, next) => {
    const { title, message, type, region } = req.body;
    
    if (!title || !message || !type || !region) {
        return res.status(400).json({
            error: 'Missing required fields',
            required: ['title', 'message', 'type', 'region']
        });
    }

    if (typeof title !== 'string' || title.length < 5) {
        return res.status(400).json({
            error: 'Invalid title',
            details: 'Title must be at least 5 characters long'
        });
    }

    if (typeof message !== 'string' || message.length < 20) {
        return res.status(400).json({
            error: 'Invalid message',
            details: 'Message must be at least 20 characters long'
        });
    }

    if (!['weather', 'flood', 'earthquake', 'other'].includes(type.toLowerCase())) {
        return res.status(400).json({
            error: 'Invalid alert type',
            allowed: ['weather', 'flood', 'earthquake', 'other']
        });
    }

    next();
};

module.exports = {
    validateReport,
    validateAlert
};