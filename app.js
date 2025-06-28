let userApiKey = "";

const apiForm = document.getElementById('apiForm');
const ytForm = document.getElementById('ytForm');
const outputDiv = document.getElementById('output');
const ytTitle = document.getElementById('ytTitle');
const ytDesc = document.getElementById('ytDesc');

apiForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const apiKeyInput = document.getElementById('apiKey').value.trim();
  if (!apiKeyInput) {
    alert("Please enter your Gemini API key.");
    return;
  }
  userApiKey = apiKeyInput;
  apiForm.style.display = "none";
  ytForm.style.display = "flex";
});

async function callGemini(prompt) {
  if (!userApiKey) {
    return "API key not set.";
  }
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + userApiKey;

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text
    ) {
      return data.candidates[0].content.parts[0].text.trim();
    } else if (data.error && data.error.message) {
      return "Gemini API error: " + data.error.message;
    } else {
      return "No response from Gemini API.";
    }
  } catch (error) {
    return "Request failed: " + error.message;
  }
}

ytForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const script = document.getElementById('videoScript').value;

  ytTitle.textContent = "Generating title...";
  ytDesc.textContent = "Generating description...";
  outputDiv.style.display = "flex";

  // Prompt for title
  const titlePrompt = `
Given the following YouTube video script or summary, generate a single catchy, engaging, and clickable YouTube video title (max 80 characters) that will maximize clicks and viewer interest. Avoid clickbait, but make it exciting and relevant.

Script/Summary:
${script}
`;

  // Prompt for SEO-optimized description
  const descPrompt = `
Given the following YouTube video script or summary, generate a compelling, SEO-optimized YouTube video description (150-300 words). 
- Include relevant keywords naturally.
- Add a call-to-action for likes, comments, and subscriptions.
- Mention what viewers will learn or gain.
- Make it engaging and easy to read.

Script/Summary:
${script}
`;

  const titleText = await callGemini(titlePrompt);
  const descText = await callGemini(descPrompt);

  ytTitle.textContent = titleText;
  ytDesc.textContent = descText;
});
