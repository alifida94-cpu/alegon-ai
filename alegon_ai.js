// alegon_ai.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// ===== Replace with your OpenAI API key =====
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";
// ==========================================

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Alegon AI</title>
<style>
body { font-family: Arial,sans-serif; background: linear-gradient(135deg,#667eea,#764ba2); color:#fff; display:flex; flex-direction:column; align-items:center; padding:30px; }
h1 { font-size:3em; margin-bottom:20px; }
#chatbox { width:90%; max-width:700px; height:500px; background:rgba(255,255,255,0.15); border-radius:15px; padding:20px; overflow-y:auto; display:flex; flex-direction:column; }
.message { margin:10px 0; padding:12px 20px; border-radius:20px; max-width:80%; line-height:1.4; }
.user { background:#4facfe; align-self:flex-end; }
.ai { background:#43e97b; align-self:flex-start; }
#userInput { width:90%; max-width:700px; padding:15px; margin-top:20px; border-radius:50px; border:none; font-size:1rem; outline:none; }
</style>
</head>
<body>
<h1>Alegon AI</h1>
<div id="chatbox"></div>
<input type="text" id="userInput" placeholder="Ask me anything..." onkeypress="checkEnter(event)">
<script>
async function sendMessage(message) {
  const chatbox = document.getElementById('chatbox');

  const userMsg = document.createElement('div');
  userMsg.className='message user';
  userMsg.textContent=message;
  chatbox.appendChild(userMsg);
  chatbox.scrollTop = chatbox.scrollHeight;

  const aiMsg = document.createElement('div');
  aiMsg.className='message ai';
  aiMsg.textContent='Typing...';
  chatbox.appendChild(aiMsg);
  chatbox.scrollTop = chatbox.scrollHeight;

  try {
    const res = await fetch('/ask', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({message})
    });
    const data = await res.json();
    aiMsg.textContent = data.reply || "No answer found.";
    chatbox.scrollTop = chatbox.scrollHeight;
  } catch(err) {
    aiMsg.textContent = 'Error getting response.';
    console.error(err);
  }
}

function checkEnter(event) {
  if(event.key==='Enter') {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if(text) { sendMessage(text); input.value=''; }
  }
}
</script>
</body>
</html>`);
});

app.post('/ask', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        temperature: 0.7
      })
    });
    const data = await response.json();
    const reply = data.choices[0].message.content;
    res.json({ reply });
  } catch(err) {
    console.error(err);
    res.json({ reply: "Error: Could not get AI response." });
  }
});

app.listen(PORT, () => console.log(`Alegon AI running on port ${PORT}`));
