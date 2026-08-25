exports.handler = async (event) => {
  try {
    const { prompt, type } = JSON.parse(event.body);

    if (type === 'text') {
      // Version publique sans clé
      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          model: "openai"
        })
      });
      
      const data = await response.json();
      console.log("Réponse API:", data);

      if (data.error) {
        throw new Error(data.error.message);
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.choices[0].message.content })
      };
    }

    if (type === 'image') {
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&nologo=true`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64 = Buffer.from(await blob.arrayBuffer()).toString('base64');
      return {
        statusCode: 200,
        body: JSON.stringify({ image: `data:image/png;base64,${base64}` })
      };
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'Type non supporté' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
