// Import required packages
const restify = require('restify');
const { BotFrameworkAdapter, ConversationState, MemoryStorage } = require('botbuilder');
const { CluBot } = require('./cluBot');
require('dotenv').config();

// Create HTTP server
const server = restify.createServer();
server.listen(process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Add error handling
adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${error}`);
    await context.sendActivity('The bot encountered an error. Please try again later.');
};

// Create conversation state with in-memory storage
const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);

// Create the bot instance
const bot = new CluBot(conversationState);

// Listen for incoming requests - THIS IS THE SECTION TO CHANGE
server.post('/api/messages', (req, res, next) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    })
    .then(() => {
        return next();
    })
    .catch(err => {
        console.error('Error processing activity:', err);
        return next(err);
    });
});