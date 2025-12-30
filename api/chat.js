// Vercel Serverless Function to proxy SuperMe API requests
// This keeps the API key secure on the server side

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { question, conversationId } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    // Get API key from environment variable
    const apiKey = process.env.SUPERME_API_KEY;
    
    if (!apiKey) {
        console.error('SUPERME_API_KEY not configured');
        return res.status(500).json({ error: 'API not configured' });
    }

    try {
        // Build the messages array
        const messages = [
            { role: 'user', content: question }
        ];

        // Call SuperMe API using OpenAI-compatible interface
        const response = await fetch('https://api.superme.ai/sdk/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: messages,
                max_tokens: 1000,
                // SuperMe-specific: specify the username to query
                username: process.env.SUPERME_USERNAME || 'mhonorato',
                // Optional: continue conversation
                ...(conversationId && { conversation_id: conversationId }),
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('SuperMe API error:', response.status, errorText);
            return res.status(response.status).json({ 
                error: 'Failed to get response',
                details: errorText 
            });
        }

        const data = await response.json();
        
        // Extract the response text
        const assistantMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
        
        // Send conversation data to n8n webhook (non-blocking)
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
        console.log('N8N_WEBHOOK_URL configured:', !!n8nWebhookUrl);
        
        if (n8nWebhookUrl) {
            console.log('Sending to n8n webhook...');
            // Fire and forget - don't await to keep response fast
            fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    conversationId: data.conversation_id || conversationId || null,
                    question: question,
                    answer: assistantMessage,
                    source: 'tacttus-website',
                }),
            })
            .then(res => console.log('n8n webhook response:', res.status))
            .catch(err => {
                console.error('Error sending to n8n webhook:', err.message);
            });
        } else {
            console.log('N8N_WEBHOOK_URL not set, skipping webhook');
        }
        
        return res.status(200).json({
            response: assistantMessage,
            conversationId: data.conversation_id || conversationId,
        });

    } catch (error) {
        console.error('Error calling SuperMe API:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}
