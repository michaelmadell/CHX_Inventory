const axios = require('axios');
const https = require('https');
const enclosureConfigs = require('./config.json');
const { url } = require('inspector');

const insecureAgent = new https.Agent({
    rejectUnauthorized: false
});

const enclosureState = new Map();

function initialiseManager() {
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

  console.log(`🔄 Attempting to refresh token for ${state.config.name}...`);
  state.isRefreshing = true;

  try {
    const { ip, username, password } = state.config;
    const response = await axios.post(`https://${ip}/api/auth/token`, {
      username,
      password
    }, {
      httpsAgent: insecureAgent
    });

    console.log(`Request to ${ip}/api/auth/token - ${enclosureId}`)

    if (response.data && response.data.accessToken) {
      state.token = response.data.accessToken;
      state.lastUpdated = new Date();
      console.log(`👍 Token refreshed successfully for ${state.config.name}.`);
      console.log(`Token = ${state.token}`)
    } else {
      state.token = null;
      console.error(`❌ Auth succeeded but no accessToken found for ${state.config.name}.`);
      
      // 👇 ADD THIS LOGGING to inspect the actual response
      console.log(`[DEBUG] Received response status: ${response.status}`);
      console.log('[DEBUG] Received response data:', JSON.stringify(response.data, null, 2));
    }
   } catch (error) {
    state.token = null;
    console.error(`❌ Failed to refresh token for ${state.config.name}:`, error.message);
  } finally {
    state.isRefreshing = false;
  }
}

function refreshAllTokens() {
  console.log('--- Starting scheduled token refresh cycle ---');
  for (const id of enclosureState.keys()) {
    refreshToken(id);
  }
}

function startScheduler() {
  refreshAllTokens();
  setInterval(refreshAllTokens, 10 * 60 * 1000);
  console.log('🗓️  Token refresh scheduler started. Will run every 10 minutes.');
}

/**
 * @param {string} enclosureId The Enclosure to target
 * @param {object} apiOptions Options for the axios request (method, url, data)
 * @returns {Promise<object>} The Data from the enclosures API
 */
async function proxyApiCall(enclosureId, { method, url, data }) {
    const state = enclosureState.get(enclosureId);

    console.log(enclosureId)

    if (!state) {
        throw new Error('Enclosure not found');
        console.error('Enclosure not found');
    }
    if (!state.token) {
        throw new Error(`No valid token for ${state.config.name}. Please wait for refresh.`);
    }

    const response = await axios({
        method,
        url: `https://${state.config.ip}/${url}`,
        headers: {
            'Authorization': `Bearer ${state.token}`
        },
        data: data,
        httpsAgent: insecureAgent // 3. Also use the shared agent here
    });

    console.log(`Sent request to https://${state.config.ip}/${url}, via method ${method}, with token ${state.token} and data ${data}`)

    return response.data;
}



module.exports = {
    startScheduler,
    proxyApiCall,
    initialiseManager
};