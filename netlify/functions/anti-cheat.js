const userRecords = {};

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
            return { statusCode: 400, headers, body: JSON.stringify({ error: "Usuário não identificado." }) };
        }

        let record = userRecords[userId] || { warnings: 0, blockedUntil: 0, reason: '', type: '' };

        // REGISTRAR VIOLAÇÃO
        if (action === 'violation') {
            // Se já está bloqueado, apenas retorna o bloqueio
            if (record.blockedUntil > Date.now()) {
                const remainingSeconds = Math.floor((record.blockedUntil - Date.now()) / 1000);
                return { statusCode: 200, headers, body: JSON.stringify({ action: 'blocked', remainingSeconds }) };
            }

            record.warnings += 1;
            record.reason = details;
            record.type = type;

            if (record.warnings >= 3) {
                // Aplica o bloqueio de 24h
                record.blockedUntil = Date.now() + 24 * 60 * 60 * 1000;
                userRecords[userId] = record;
                return { 
                    statusCode: 200, headers, 
                    body: JSON.stringify({ action: 'blocked', remainingSeconds: 24 * 60 * 60 }) 
                };
            } else {
                userRecords[userId] = record;
                return { 
                    statusCode: 200, headers, 
                    body: JSON.stringify({ action: 'warning', warnings: record.warnings }) 
                };
            }
        } 
        
        // VERIFICAR BLOQUEIO
        if (action === 'check') {
            if (record.blockedUntil > Date.now()) {
                const remainingSeconds = Math.floor((record.blockedUntil - Date.now()) / 1000);
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ blocked: true, reason: record.reason, remainingSeconds })
                };
            } else {
                // Se o tempo passou, remove o bloqueio e zera avisos
                if (record.blockedUntil > 0) {
                    delete userRecords[userId];
                }
                return { statusCode: 200, headers, body: JSON.stringify({ blocked: false }) };
            }
        }

        // DESBLOQUEAR TODOS (Admin)
        if (action === 'unban_all') {
            Object.keys(userRecords).forEach(k => delete userRecords[k]);
            return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: "Todos os usuários foram desbloqueados." }) };
        }

        return { statusCode: 404, headers, body: JSON.stringify({ error: "Ação inválida." }) };

    } catch (err) {
        console.error(err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: "Erro interno no servidor." }) };
    }
};
