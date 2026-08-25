exports.handler = async (event) => {
  try {
    const { prompt, type } = JSON.parse(event.body);

    if (type === 'text') {
      // API Texte Pollinations 100% gratuite sans clé
      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "openai-large", // modèle gratuit
          messages: [{ role: "user", content: prompt }],
          seed: Math.floor(Math.random() * 1000000) // pour avoir des réponses différentes
        })
      });
      
      const data = await response.json();

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.choices[0].message.content })
      };
    }

    if (type === 'image') {
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&nologo=true&width=1024&height=1024`;
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
