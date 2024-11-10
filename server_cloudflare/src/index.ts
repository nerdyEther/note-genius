import Groq from "groq-sdk";
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { OpenAI } from 'openai';

type Bindings = {
    GROQ_API_KEY: string;
	AI: Ai; // Use Groq API Keclear
	
};

// Define the expected structure of the response from the Groq API
interface GroqChatCompletion {
    choices: Array<{ message: { content: string } }>; // Groq's response format
}

const app = new Hono<{ Bindings: Bindings }>();

app.use(
    '/*',
    cors({
        origin: '*',
        allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
        allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT'],
        exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
        maxAge: 600,
        credentials: true,
    })
);

app.post('/chatToDocument', async (c) => {
    console.log('Received request to /chatToDocument');
    try {
        const groqApiKey = c.env.GROQ_API_KEY;
		const groq = new Groq({ apiKey: groqApiKey });

        if (!groqApiKey) {
            console.error('GROQ_API_KEY is not defined in environment variables');
            return c.json({ error: 'GROQ_API_KEY is not configured' }, 500);
        }

        const { documentData, question } = await c.req.json();

        if (!documentData || !question) {
            console.log('Missing documentData or question');
            return c.json({ error: 'Missing documentData or question' }, 400);
        }

        // Clean and prepare the document data
        const cleanDocumentData = documentData.replace(/<\/?[^>]+(>|$)/g, "").trim();
        
        console.log('Cleaned Document Data:', cleanDocumentData);
        console.log('Question:', question);

        let response: string | null = null;

        try {
            // Prepare the message for the Llama model
            const messages = [
                {
                    role: "system",
                    content: `Here is a document: ${cleanDocumentData}`,
                },
                {
                    role: "user",
                    content: `Please answer the question: "${question}"`,
                },
            ];

            console.log('Messages sent to Groq Llama model:', messages);

            // Call Groq's API to get the response from the Llama model
            const chatCompletion = await groq.chat.completions.create({
                messages: messages.map(msg => ({
                    role: msg.role as 'system' | 'user' | 'assistant',
                    content: msg.content
                })),
                model: 'llama3-8b-8192', // Using Llama3 model
            });

            // Check for generated answers in the 'choices' array
            if (chatCompletion.choices?.length > 0) {
                response = chatCompletion.choices[0].message?.content?.trim() ?? '';
            } else {
                console.error('No generated text returned by Groq API');
                return c.json({ error: 'No response generated by Groq' }, 500);
            }
        } catch (error) {
            console.error('Groq API Error:', error);
            return c.json({ error: 'Error calling Groq API', details: error instanceof Error ? error.message : 'Unknown error' }, 500);
        }

        console.log('Groq Response:', response);
        return c.json({ message: response });
    } catch (error) {
        console.error('Error in /chatToDocument:', error);
        return c.json({ error: 'An unknown error occurred while processing your request' }, 500);
    }
});

app.post('/translateDocument', async (c) => {
	const { documentData, targetLang } = await c.req.json();

	// generate a summary of the document
	const summaryResponse = await c.env.AI.run('@cf/facebook/bart-large-cnn', {
		input_text: documentData,
		max_length: 1000,
	});

	// translate the summary to another language
	const response = await c.env.AI.run('@cf/meta/m2m100-1.2b', {
		text: summaryResponse.summary,
		source_lang: 'english', // defaults to english
		target_lang: targetLang,
	});

	return new Response(JSON.stringify(response));
});


export default app;