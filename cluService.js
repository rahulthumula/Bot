const axios = require('axios');
require('dotenv').config();

// Environment variables
const CLU_ENDPOINT = process.env.CLU_ENDPOINT;
const CLU_API_KEY = process.env.CLU_API_KEY;
const CLU_PROJECT_NAME = process.env.CLU_PROJECT_NAME;
const CLU_DEPLOYMENT_NAME = process.env.CLU_DEPLOYMENT_NAME;

/**
 * Analyzes user input to determine intent using Azure CLU
 * @param {string} utterance - The user's text input
 * @returns {Promise<object>} - The CLU analysis result
 */
async function analyzeCluIntent(utterance) {
    try {
        const url = `${CLU_ENDPOINT}/language/:analyze-conversations?api-version=2022-10-01-preview`;
        
        const payload = {
            kind: "Conversation",
            analysisInput: {
                conversationItem: {
                    id: "1",
                    text: utterance,
                    participantId: "user"
                }
            },
            parameters: {
                projectName: CLU_PROJECT_NAME,
                deploymentName: CLU_DEPLOYMENT_NAME,
                verbose: true
            }
        };
        
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': CLU_API_KEY
            }
        });
        
        return response.data.result;
    } catch (error) {
        console.error(`Error calling CLU service: ${error}`);
        throw error;
    }
}

module.exports.analyzeCluIntent = analyzeCluIntent;