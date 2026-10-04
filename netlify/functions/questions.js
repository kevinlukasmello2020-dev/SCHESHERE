const testQuestions = [
    {
        id: 1,
        question: "Para que serve o Everything?",
        options: [
            "A) Editar arquivos de vídeo",
            "B) Pesquisar rapidamente arquivos e pastas no computador",
            "C) Monitorar a temperatura do computador",
            "D) Limpar arquivos temporários"
        ]
    },
    {
        id: 2,
        question: "O que o RecentFilesView permite visualizar?",
        options: [
            "A) Arquivos acessados recentemente",
            "B) Senhas salvas no navegador",
            "C) Processos em execução",
            "D) Dispositivos USB conectados"
        ]
    },
    {
        id: 3,
        question: "Para que serve o USBDeview?",
        options: [
            "A) Analisar processos do Windows",
            "B) Visualizar informações sobre dispositivos USB",
            "C) Localizar arquivos no computador",
            "D) Visualizar downloads do navegador"
        ]
    },
    {
        id: 4,
        question: "O que o Process Hacker permite visualizar?",
        options: [
            "A) Processos e informações relacionadas ao sistema",
            "B) Apenas arquivos excluídos",
            "C) Apenas histórico do navegador",
            "D) Apenas dispositivos USB"
        ]
    },
    {
        id: 5,
        question: "Qual é a principal finalidade de uma Screen Share?",
        options: [
            "A) Procurar qualquer arquivo suspeito e punir o usuário",
            "B) Realizar uma análise técnica e verificar possíveis irregularidades",
            "C) Alterar arquivos do computador",
            "D) Instalar programas no computador do usuário"
        ]
    },
    {
        id: 6,
        question: "Por que o Everything pode ser útil durante uma Screen Share?",
        options: [
            "A) Porque identifica automaticamente qualquer cheat",
            "B) Porque permite localizar arquivos e pastas rapidamente",
            "C) Porque bloqueia programas suspeitos",
            "D) Porque mostra todas as senhas do computador"
        ]
    },
    {
        id: 7,
        question: "O que o BrowserDownloadsView pode ajudar a verificar?",
        options: [
            "A) Informações relacionadas aos downloads registrados pelos navegadores",
            "B) Processos ativos do Windows",
            "C) Dispositivos USB conectados",
            "D) Arquivos presentes na memória RAM"
        ]
    },
    {
        id: 8,
        question: "Qual ferramenta está diretamente relacionada às Jump Lists do Windows?",
        options: [
            "A) USBDeview",
            "B) Everything",
            "C) JumpListsView",
            "D) Process Hacker"
        ]
    },
    {
        id: 9,
        question: "Ao encontrar um arquivo com nome suspeito, qual é a atitude correta?",
        options: [
            "A) Considerar automaticamente uma prova de irregularidade",
            "B) Excluir o arquivo imediatamente",
            "C) Verificar o contexto e procurar outras informações antes de concluir",
            "D) Encerrar a Screen Share"
        ]
    },
    {
        id: 10,
        question: "Por que informações de dispositivos USB podem ser relevantes durante uma análise?",
        options: [
            "A) Porque todo dispositivo USB é proibido",
            "B) Porque podem fornecer informações sobre dispositivos reconhecidos pelo sistema",
            "C) Porque mostram as senhas do usuário",
            "D) Porque permitem descobrir a senha do Discord"
        ]
    },
    {
        id: 11,
        question: "Uma ferramenta apresenta uma informação potencialmente suspeita. O que o responsável pela Screen Share deve fazer?",
        options: [
            "A) Aplicar punição imediatamente",
            "B) Ignorar a informação",
            "C) Correlacionar a informação com outros dados antes de chegar a uma conclusão",
            "D) Excluir o arquivo relacionado"
        ]
    },
    {
        id: 12,
        question: "Por que utilizar mais de uma ferramenta durante uma análise pode ser importante?",
        options: [
            "A) Para aumentar a quantidade de programas instalados",
            "B) Porque diferentes ferramentas podem fornecer informações complementares",
            "C) Porque uma ferramenta deixa a outra mais rápida",
            "D) Porque todas as ferramentas apresentam os mesmos dados"
        ]
    },
    {
        id: 13,
        question: "Um arquivo suspeito foi encontrado pelo Everything, mas não existem outras informações que confirmem seu uso. Qual é a melhor atitude?",
        options: [
            "A) Considerar o usuário culpado",
            "B) Investigar outras evidências e o contexto antes de tomar uma decisão",
            "C) Excluir o arquivo",
            "D) Encerrar imediatamente a análise"
        ]
    },
    {
        id: 14,
        question: "Durante uma análise, duas ferramentas apresentam informações aparentemente diferentes. O que deve ser feito?",
        options: [
            "A) Escolher a informação mais suspeita",
            "B) Ignorar ambas",
            "C) Analisar o contexto, a origem e a relevância das informações",
            "D) Aplicar punição automaticamente"
        ]
    },
    {
        id: 15,
        question: "Qual atitude representa melhor uma Screen Share profissional?",
        options: [
            "A) Procurar apenas informações que confirmem uma suspeita",
            "B) Basear a decisão na opinião de outros jogadores",
            "C) Manter imparcialidade e tomar decisões com base em evidências verificadas",
            "D) Modificar arquivos encontrados para facilitar a análise"
        ]
    },
    {
        id: 16,
        question: "Durante uma Screen Share, o Everything aponta um arquivo com nome relacionado a uma ferramenta proibida. O RecentFilesView não apresenta acesso recente ao arquivo, e não existem outros indícios relacionados. Qual é a conclusão tecnicamente mais correta?",
        options: [
            "A) O arquivo prova que a ferramenta foi utilizada e o jogador deve ser punido.",
            "B) O arquivo deve ser imediatamente excluído para evitar uma nova utilização.",
            "C) A existência do arquivo, isoladamente, não comprova utilização; é necessário analisar contexto e outras evidências antes de concluir.",
            "D) O Everything está necessariamente apresentando uma informação falsa."
        ]
    },
    {
        id: 17,
        question: "Durante uma análise, o Process Hacker apresenta um processo desconhecido, enquanto outras ferramentas não apresentam qualquer informação relacionada a ele. Qual deve ser o procedimento de um Screen Sharer experiente?",
        options: [
            "A) Considerar o processo como cheat imediatamente.",
            "B) Encerrar o processo e continuar a análise.",
            "C) Investigar a origem, localização, contexto e demais informações disponíveis antes de classificá-lo como irregular.",
            "D) Ignorar completamente o processo porque somente uma ferramenta o identificou."
        ]
    },
    {
        id: 18,
        question: "Um candidato apresenta simultaneamente informações suspeitas em diferentes ferramentas, porém cada informação, analisada isoladamente, possui uma possível explicação legítima. Qual é a abordagem mais adequada?",
        options: [
            "A) Considerar todas as informações irrelevantes porque possuem explicações possíveis.",
            "B) Considerar automaticamente o conjunto como prova definitiva.",
            "C) Correlacionar cronologia, contexto e informações das diferentes ferramentas para determinar se existe uma evidência consistente de irregularidade.",
            "D) Escolher somente a informação mais suspeita e basear a decisão nela."
        ]
    }
];

exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(testQuestions)
    };
};
