exports.handler = async (event) => {
  console.log("Fonction appelée", event.httpMethod);

  if (event.httpMethod!== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt, type } = JSON.parse(event.body);
    const POLLINATIONS_KEY = process.env.POLLINATIONS_KEY;

    console.log("Type:", type);
    console.log("Key existe:",!!POLLINATIONS_KEY);

    if (!POLLINATIONS_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'POLLINATIONS_KEY manquante' }) };
    }

    if (type === 'text') {
      const apiUrl = 'https://text.pollinations.ai/openai';
      const body = {
        model: "openai",
        messages: [{ role: "user", content: prompt }]
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${POLLINATIONS_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.choices[0].message.content })
      };
    }

    if (type === 'image') {
      const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&nologo=true`;
      const response = await fetch(apiUrl);
      const blob = await response.blob();
      const base64 = Buffer.from(await blob.arrayBuffer()).toString('base64');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: `data:image/png;base64,${base64}` })
      };
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'Type non supporté' }) };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
