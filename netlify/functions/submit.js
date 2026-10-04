const MIN_SCORE_TO_PASS = 13; // 13/18

const testAnswers = {
    1: 1, 2: 0, 3: 1, 4: 0, 5: 1, 6: 1, 7: 0, 8: 2, 9: 2, 10: 1,
    11: 2, 12: 1, 13: 1, 14: 2, 15: 2, 16: 2, 17: 2, 18: 2
};

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        const { name, discordId, answers } = body;

        if (!name || !discordId || !answers || Object.keys(answers).length !== 18) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: 'Dados incompletos. Preencha tudo e responda todas as questões.' })
            };
        }

        let correctCount = 0;
        let wrongCount = 0;
        let review = [];

        Object.keys(testAnswers).forEach((qId) => {
            const numId = parseInt(qId);
            const userAnswer = answers[numId];
            const isCorrect = userAnswer === testAnswers[numId];

            if (isCorrect) correctCount++;
            else wrongCount++;

            review.push({
                questionId: numId,
                userAnswer: ["A", "B", "C", "D"][userAnswer] || "Nenhuma",
                isCorrect: isCorrect
            });
        });

        const totalQuestions = 18;
        const percentage = Math.round((correctCount / totalQuestions) * 100);
        const passed = correctCount >= MIN_SCORE_TO_PASS;

        const resultData = {
            correctCount,
            wrongCount,
            percentage,
            passed,
            review: review.map(r => ({ id: r.questionId, isCorrect: r.isCorrect }))
        };

        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        if (webhookUrl) {
            const fields = [];
            review.forEach((r) => {
                fields.push({
                    name: `Questão ${String(r.questionId).padStart(2, '0')}`,
                    value: `Resposta: ${r.userAnswer}\nStatus: ${r.isCorrect ? '✅ Acertou' : '❌ Errou'}`,
                    inline: false
                });
            });

            const embed = {
                title: '📋 NOVO TESTE DE SCREEN SHARE',
                color: passed ? 0x00FF00 : 0xFF0000,
                fields: [
                    { name: '👤 Candidato', value: name, inline: true },
                    { name: '🆔 ID Discord', value: discordId, inline: true },
                    { name: '📊 Resultado', value: `${correctCount}/${totalQuestions}`, inline: true },
                    { name: '📈 Aproveitamento', value: `${percentage}%`, inline: true },
                    { name: '✅ Status', value: passed ? 'APROVADO' : 'REPROVADO', inline: true },
                    { name: '\u200B', value: '📝 **RESPOSTAS DO CANDIDATO**', inline: false },
                    ...fields
                ],
                footer: { text: 'Distrito Roleplay - Sistema de Testes' },
                timestamp: new Date().toISOString()
            };

            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(resultData)
        };

    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: 'Erro interno.' })
        };
    }
};
