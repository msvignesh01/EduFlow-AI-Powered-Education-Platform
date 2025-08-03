// Old OpenAI API call
// const response = await fetch('https://api.openai.com/v1/chat/completions', {
//   method: 'POST',
//   headers: {
//     'Authorization': `Bearer ${OPENAI_API_KEY}`,
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({ model, messages })
// });

// New Groq API call
const response = await fetch('https://api.groq.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${GROQ_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ model, messages })
});