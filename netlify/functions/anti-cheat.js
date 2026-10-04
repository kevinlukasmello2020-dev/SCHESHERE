// Memória temporária para armazenar os bloqueios.
// NOTA: Em um ambiente serverless real no Netlify, esta variável pode ser resetada caso
// a função fique ociosa por muito tempo. Para produção total, os dados devem ser salvos em um banco de dados externo.
const userBlocks = {};

exports.handler = async function(event, context) {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, headers, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { userId, type, details } = body;
        const action = body.action || (event.path.includes('violation') ? 'violation' : 'check');

        if (!userId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Usuário não identificado." })
            };
        }

        // REGISTRAR VIOLAÇÃO
        if (action === 'violation') {
            const blockedAt = new Date();
            const blockedUntil = new Date(blockedAt.getTime() + 24 * 60 * 60 * 1000); // 24 horas
            
            userBlocks[userId] = {
                type: type,
                reason: details,
                blockedUntil: blockedUntil.getTime()
            };

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    remainingSeconds: 24 * 60 * 60 
                })
            };
        } 
        
        // VERIFICAR BLOQUEIO
        if (action === 'check') {
            const block = userBlocks[userId];
            if (!block) {
                return { statusCode: 200, headers, body: JSON.stringify({ blocked: false }) };
            }

            const now = Date.now();
            const remainingSeconds = Math.floor((block.blockedUntil - now) / 1000);

            if (remainingSeconds <= 0) {
                delete userBlocks[userId]; // Bloqueio expirou
                return { statusCode: 200, headers, body: JSON.stringify({ blocked: false }) };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    blocked: true,
                    type: block.type,
                    reason: block.reason,
                    remainingSeconds: remainingSeconds
                })
            };
        }

        return { statusCode: 404, headers, body: JSON.stringify({ error: "Ação inválida." }) };

    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Erro interno no servidor." })
        };
    }
};
