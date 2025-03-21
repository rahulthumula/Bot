# CLU Behavior Change Chatbot

A Node.js chatbot that integrates with Azure Conversational Language Understanding (CLU) to detect stages of behavior change in user inputs and provide appropriate responses.

## Project Overview

This project implements a conversational agent that can:
- Accept user text input related to behavior change
- Analyze the intent using Azure CLU
- Classify inputs into stages of behavior change (Precontemplation, Contemplation, Preparation, Action, Maintenance)
- Provide stage-appropriate responses to the user

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Azure account with CLU model deployed
- API key and endpoint for your Azure Language Service

## Project Structure

```
clu-chatbot/
├── .env                  # Environment variables (not in repo)
├── index.js              # Main entry point and server setup
├── cluBot.js             # Bot implementation
├── cluService.js         # CLU service integration
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## Setup Instructions

### 1. Install Dependencies

```bash
# Initialize the project
npm init -y

# Install required dependencies
npm install botbuilder restify dotenv axios
```

### 2. Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```
# Azure Language Service Credentials
CLU_ENDPOINT=your_azure_language_service_endpoint
CLU_API_KEY=your_azure_language_service_api_key
CLU_PROJECT_NAME=your_clu_project_name
CLU_DEPLOYMENT_NAME=your_clu_deployment_name

# Bot Framework Configuration
MicrosoftAppId=
MicrosoftAppPassword=
```

### 3. Run the Chatbot

```bash
node index.js
```

The bot will start and listen on port 3978 (or the port specified in your environment).

## Testing

### Option 1: Test with Postman

1. Start the bot: `node index.js`
2. Create a POST request to: `http://localhost:3978/test`
3. Set headers: `Content-Type: application/json`
4. Set the body to: 
   ```json
   {
     "text": "I don't think I have a problem with drinking"
   }
   ```
5. Send the request and observe the response

### Option 2: Test with Bot Framework Emulator

1. Start the bot: `node index.js`
2. Open Bot Framework Emulator
3. Connect to: `http://localhost:3978/api/messages`
4. Start chatting with the bot

## Response Examples

Different stages of behavior change will trigger different bot responses:

- **Precontemplation**: "It sounds like you might not be considering change right now. What are your thoughts about your current situation?"
- **Contemplation**: "You seem to be thinking about making some changes. What benefits do you see in changing?"
- **Preparation**: "You're preparing to make a change! What steps have you planned to take?"
- **Action**: "Great job taking action! What changes have you implemented so far?"
- **Maintenance**: "You're working on maintaining your changes. What strategies help you stay consistent?"

## Console Output

When running the bot, you'll see console output like:

```
restify listening to http://[::]:3978
Received message: I don't think I have a 
Intent result: {
  "query": "I don't think I have a ",
  "prediction": {
    "topIntent": "Precontemplation",
    "projectKind": "Conversation",
    "intents": [
      {
        "category": "Precontemplation",
        "confidenceScore": 0.83196354
      },
      ...
    ],
    "entities": []
  }
}
Would respond with: It sounds like you might not be considering change right now. What are your thoughts about your current situation?
```



# Bot
