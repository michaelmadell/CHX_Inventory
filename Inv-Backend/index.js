const express = require('express');
const { startScheduler, proxyApiCall, initialiseManager } = require('./enclosureManager.js');

const app = express();
const PORT = process.env.PORT || 4000;

try {
    initialiseManager();
    startScheduler();
} catch (error) {
    console.error('Fatal: failed to initalise enclosure manager');
    console.error(error);
    process.exit(1);
}

app.use(express.json);

app.post('/api/proxy/:enclosureId', async (req, res) => {
    const { enclosureId } = req.params;
    console.log(enclosureId)
    const { method, url, data } = req.body;
    console.log(method, url, data)

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

app.listen(PORT)

process.on('uncaughtException', (error) => {
  console.error('🔥🔥🔥 UNCAUGHT EXCEPTION! The server crashed!');
  console.error(error);
  process.exit(1);
});