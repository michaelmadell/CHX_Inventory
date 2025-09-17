const axios = require('axios');
const enclosureConfigs = require('./config.json');

const enclosureState = new Map();

function initializeManager() {
    for (const config of enclosureConfigs) {
        enclosureState.set(config.id, {
            config: config,
            token: null,
            lastUpdated: null,
            isRefreshing: false
        });
    }
    console.log(`Manager initialised with ${enclosureState.size} enclosures.`);
}

/**
 * Fetches new API Token from a specific enclosure.
 * @param {string} enclosureId - The ID of the enclosure from config.json
 */
async function refreshToken(enclosureId) {
    const state = enclosureState.get(enclosureId);
    if (!state || state.isRefreshing) {
        return;
    }

    console.log(`Attempting to refresh token for ${state.config.name}...`);
    state.isRefreshing = true;

    try {
        const { ip, username, password } = state.config;
        const response = await axios.post(`https://${ip}/auth/token`, {
            username,
            password
        });

        if (response.data && response.data.token) {
            state.token = response.data.token;
            state.lastUpdated = new Date();
            console.log(`Token refreshed successfully for ${state.config.name}.`);
        }
    } catch (err) {
        state.token = null;
        console.error(`Failed to refresh token for ${state.config.name}:`, err.message);
    } finally {
        state.isRefreshing = false;
    }
}

function refreshAllTokens() {
    console.log('---- Starting scheduled token refresh ----');
    for (const id of enclosureState.keys()) {
        refreshToken(id);
    }
}

function startScheduler() {
    refreshAllTokens();

    setInterval(refreshAllTokens, 10 * 60 * 1000);

    console.log('Token refresh scheduler started. will run every 10 minutes.');
}

/**
 * @param {string} enclosureId The Enclosure to target
 * @param {object} apiOptions Options for the axios request (method, url, data)
 * @returns {Promise<object>} The Data from the enclosures API
 */
async function proxyApiCall(enclosureId, { method, url, data }) {
    const state = enclosureState.get(enclosureId);

    if (!state) throw new Error('Enclosure not found.');
    if (!state.token) throw new Error(`No valid token for ${state.config.name}. Please wait for refresh.`);

    const response = await axios({
        method,
        url: `https://${state.config.ip}/${url}`,
        headers: {
            'Authorization': `Bearer ${state.token}`
        },
        data: data
    });

    return response.data;
}

initializeManager();

module.exports = {
    startScheduler,
    proxyApiCall
};