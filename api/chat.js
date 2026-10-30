// Exemplo de rota serverless (Vercel API Route / Node.js)
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { model, messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Mensagens inválidas' });
    }

    // Pega a chave da Groq de forma segura das variáveis de ambiente do servidor
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
        return res.status(500).json({ error: 'Chave da API Groq não configurada no servidor.' });
    }

    // Mapeamento dos modelos para o endpoint oficial da Groq
    let groqModel = "llama3-70b-8192"; // padrão
    if (model === 'foco-wanga-3.0' || model === 'llama-3-70b') {
        groqModel = "llama3-70b-8192";
    } else if (model === 'mixtral-8x7b') {
        groqModel = "mixtral-8x7b-32768";
    }

    try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: groqModel,
                messages: messages,
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        const data = await groqResponse.json();

        if (!groqResponse.ok) {
            throw new Error(data.error?.message || 'Erro na comunicação com a Groq');
        }

        const reply = data.choices[0].message.content;

        return res.status(200).json({ reply });

    } catch (error) {
        console.error('Erro Groq API:', error);
        return res.status(500).json({ error: error.message });
    }
}
