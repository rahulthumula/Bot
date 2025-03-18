const { ActivityHandler, ActivityTypes } = require('botbuilder');
const { analyzeCluIntent } = require('./cluService');

class CluBot extends ActivityHandler {
    constructor(conversationState) {
        super();
        this.conversationState = conversationState;
        
        this.onMessage(async (context, next) => {
            console.log("Received message:", context.activity.text);
            
            try {
                // Check if this is a direct API test (like from Postman)
                const isDirectTest = context.activity.channelId === 'test';
                
                const userInput = context.activity.text;
                const intentResult = await analyzeCluIntent(userInput);
                
                // Add debug logging
                console.log("Intent result:", JSON.stringify(intentResult, null, 2));
                
                let topIntent = "None";
                let score = 0;
                
                if (intentResult && intentResult.prediction) {
                    topIntent = intentResult.prediction.topIntent || "None";
                    
                    if (intentResult.prediction.intents && 
                        intentResult.prediction.intents[topIntent]) {
                        score = intentResult.prediction.intents[topIntent].confidenceScore || 0;
                    }
                }
                
                // Generate response based on the detected intent
                let botResponse = this.generateResponseForIntent(topIntent, score);
                
                // For direct testing, log response but don't try to send if it would fail
                if (isDirectTest) {
                    console.log("Would respond with:", botResponse);
                    // For Postman tests, you might need to handle response differently
                    if (context.activity.serviceUrl === 'http://localhost:3978') {
                        return { type: 'message', text: botResponse };
                    }
                } else {
                    // Normal bot channel response
                    await context.sendActivity(botResponse);
                }
            } catch (error) {
                console.error(`Error in message handler:`, error);
                // Try to respond with error message if possible
                try {
                    await context.sendActivity("I'm having trouble understanding. Could you rephrase?");
                } catch (sendError) {
                    console.error("Could not send error response:", sendError);
                }
            }
            
            await next();
        });
        
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity('Hello! I\'m a behavior change stage detection bot. How are you feeling about making changes in your life?');
                }
            }
            await next();
        });
    }
    
    generateResponseForIntent(intent, confidenceScore) {
        // You can customize responses for each intent
        const responses = {
            'Precontemplation': "It sounds like you might not be considering change right now. What are your thoughts about your current situation?",
            'Contemplation': "You seem to be thinking about making some changes. What benefits do you see in changing?",
            'Preparation': "You're preparing to make a change! What steps have you planned to take?",
            'Action': "Great job taking action! What changes have you implemented so far?",
            'Maintenance': "You're working on maintaining your changes. What strategies help you stay consistent?",
            'None': "I'm not sure I understand. Could you tell me more about your thoughts on making changes?"
        };
        
        return responses[intent] || responses['None'];
    }
    
    async run(context) {
        await super.run(context);
        await this.conversationState.saveChanges(context);
    }
}

module.exports.CluBot = CluBot;