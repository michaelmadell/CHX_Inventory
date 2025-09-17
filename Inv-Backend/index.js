const express = require('express');
const { startScheduler, proxyApiCall } = require('./enclosureManager');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json);
startScheduler();

app.post('/api/proxy/:enclosureId', async (req, res) => {
    const { enclosureId } = req.params;
    const { method, url, data } = req.body;

    if (!method || !url) {
        return res.status(400).json({ error: 'Request body must include "method" and "url".'});
    }

    try {
        const apiResponse = await proxyApiCall(enclosureId, { method, url, data });
        res.status(200).json(apiResponse);
    } catch (err) {
        console.error(`[Proxy Error] for ${enclosureId}:`, err.message);
        res.status(500).json({error: 'Failed to proxy request.', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});