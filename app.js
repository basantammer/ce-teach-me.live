const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chat-messages");
const apiKey = "AIzaSyAIaXHfZMu2Nt18LVf7XGjh3eo11bxSAWA"; // Replace with your actual Gemini API key
const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const messageToAttach =
    "If the coming text is not related to programming, programming languages, computer science, or computer engineering, just say, I'm here to help! How can I assist you with topics like algorithms, programming languages, computer networks, machine learning, or operating systems? if related to algorithms, programming languages, computer networks, machine learning, or operating systems answer normally";

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userInput = input.value;
    input.value = "";

    const message = `${messageToAttach} ${userInput}`;

    messages.innerHTML += `<div class="message user-message">
        <img src="./icons/user.png" alt="user icon"> <span>${userInput}</span>
    </div>`;

    try {
        const response = await axios.post(
            `${apiUrl}?key=${apiKey}`,
            {
                contents: [{
                    parts: [{
                        text: message
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 2048,
                }
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        const chatbotResponse = response.data.candidates[0].content.parts[0].text;
        const formattedResponse = formatResponse(chatbotResponse);

        messages.innerHTML += `<div class="message bot-message">
            <img src="./icons/chatbot.png" alt="bot icon"> <span>${formattedResponse}</span>
        </div>`;
    } catch (error) {
        console.error("Error:", error);
        messages.innerHTML += `<div class="message bot-message">
            <img src="./icons/chatbot.png" alt="bot icon"> <span>Sorry, there was an error processing your request.</span>
        </div>`;
    }
});

function formatResponse(text) {
    const codeBlockRegex = /```[\s\S]*?```/g;
    const inlineCodeRegex = /`[^`\n]+`/g;

    // Replace code blocks
    text = text.replace(codeBlockRegex, match => {
        const code = match.slice(3, -3).trim();
        return `<pre><code>${escapeHtml(code)}</code></pre>`;
    });

    // Replace inline code
    text = text.replace(inlineCodeRegex, match => {
        const code = match.slice(1, -1);
        return `<code>${escapeHtml(code)}</code>`;
    });

    // Replace newlines with <br> tags
    text = text.replace(/\n/g, "<br>");

    return text;
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}