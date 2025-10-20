// Importa os módulos necessários
const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cron = require('node-cron');
const cors = require('cors'); // Importa o cors para permitir requisições de diferentes origens
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Senhas para as rotas de administração (carregadas do .env)
const SENHA_ADMIN_ZERAR_RELATORIO = process.env.SENHA_ADMIN_ZERAR_RELATORIO;
const SENHA_ADMIN_GERAL = process.env.SENHA_ADMIN_GERAL;

// ----------------------------------------------------
// Lógica de Leitura de Matrículas e Nomes
// ----------------------------------------------------
let listaDeFuncionarios = [];

function lerDadosDoCSV(nomeDoArquivo) {
    const caminhoDoArquivo = path.join(__dirname, nomeDoArquivo);
    try {
        const conteudo = fs.readFileSync(caminhoDoArquivo, 'utf8');
        const linhas = conteudo.trim().split('\n');
        linhas.shift(); // Remove o cabeçalho
        return linhas.map(linha => {
            const [matricula, nome] = linha.split(';');
            return { matricula: matricula.trim(), nome: nome.trim() };
        });
    } catch (erro) {
        console.error(`Erro ao ler o arquivo CSV: ${erro.message}`);
        return [];
    }
}

// Carrega as matrículas do arquivo CSV no escopo global
listaDeFuncionarios = lerDadosDoCSV('matriculas.csv');
console.log(`Carregadas ${listaDeFuncionarios.length} matrículas para a memória.`);

// ----------------------------------------------------
// Conexão com o MongoDB
// ----------------------------------------------------
const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
    console.error('Erro: A variável de ambiente MONGODB_URI não está definida.');
    process.exit(1);
}

mongoose.connect(dbURI)
    .then(() => {
        console.log('Conexão com o MongoDB estabelecida!');
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });

        // Tarefa Agendada: Zerar o Relatório Diário
        cron.schedule('0 0 * * *', async () => {
            try {
                const resultado = await Acesso.deleteMany({});
                console.log(`Tarefa agendada: Relatório diário zerado com sucesso. ${resultado.deletedCount} registros removidos.`);
            } catch (erro) {
                console.error('Erro na tarefa agendada ao zerar o relatório:', erro);
            }
        }, {
            scheduled: true,
            timezone: "America/Sao_Paulo"
        });
        console.log('Tarefa de limpeza diária agendada para meia-noite.');

    })
    .catch((err) => {
        console.error('Erro de conexão com o MongoDB:', err);
        process.exit(1);
    });

// ----------------------------------------------------
// Schema e Modelo do MongoDB para Acessos
// ----------------------------------------------------
const acessoSchema = new mongoose.Schema({
    matricula: String,
    nome: String,
    status: String,
    dataHora: { type: Date, default: Date.now }
});

const Acesso = mongoose.model('Acesso', acessoSchema);

// ----------------------------------------------------
// Funções de Lógica (Refatoradas e Melhoradas)
// ----------------------------------------------------

// Função para obter o início e o fim do dia com base no fuso horário do Brasil
// Função para obter o início e o fim do dia (VERSÃO CORRIGIDA E MAIS ROBUSTA)
function getInicioFimDoDia(dataString) { // Agora recebe a string 'AAAA-MM-DD'
    // Exemplo de dataString: "2025-10-19"
    
    // Cria o início do dia explicitamente no fuso horário do Brasil (-03:00)
    const inicioDoDia = new Date(`${dataString}T00:00:00.000-03:00`);
    
    // Cria o fim do dia explicitamente no fuso horário do Brasil (-03:00)
    const fimDoDia = new Date(`${dataString}T23:59:59.999-03:00`);

    return { inicioDoDia, fimDoDia };
}

// Função para registrar acesso no MongoDB
async function registrarAcesso(matricula, nome, status) {
    const novoAcesso = new Acesso({
        matricula,
        nome,
        status,
        dataHora: new Date()
    });
    try {
        await novoAcesso.save();
        console.log('Acesso registrado no MongoDB com sucesso!');
    } catch (erro) {
        console.error('Erro ao registrar acesso no MongoDB:', erro);
    }
}

// Função para verificar se a matrícula já foi usada hoje (no MongoDB)
async function jaAcessouHoje(matricula) {
    const { inicioDoDia, fimDoDia } = getInicioFimDoDia(new Date());

    try {
        const acessoExistente = await Acesso.findOne({
            matricula: matricula,
            status: 'concedido',
            dataHora: { $gte: inicioDoDia, $lte: fimDoDia }
        });
        return !!acessoExistente;
    } catch (erro) {
        console.error('Erro ao verificar acesso no MongoDB:', erro);
        return false;
    }
}

// Função para buscar os dados de acesso (retorna JSON)
// Função para buscar os dados de acesso (retorna JSON)
async function buscarRegistrosDoDia(dataParaRelatorio, termoBusca, criterioBusca) {
    try {
        // Se nenhuma data for fornecida, usa a data de hoje no fuso de São Paulo
        const dataHojeBrasil = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
        const dataString = dataParaRelatorio || dataHojeBrasil; // Usa a data do filtro ou a de hoje

        const { inicioDoDia, fimDoDia } = getInicioFimDoDia(dataString);
        
        // Objeto de consulta base (sempre filtra por data)
        const query = {
            dataHora: { $gte: inicioDoDia, $lte: fimDoDia }
        };

        // Adiciona o filtro de busca, se houver
        if (termoBusca && criterioBusca) {
            // Usa regex para busca case-insensitive (não diferencia maiúsculas de minúsculas)
            query[criterioBusca] = { $regex: termoBusca, $options: 'i' };
        }
        
        return await Acesso.find(query).sort({ dataHora: 1 }); // Ordena do mais antigo para o mais novo

    } catch (erro) {
        console.error('Erro ao buscar registros no MongoDB:', erro);
        return [];
    }
}

// Função para gerar o relatório em formato de string (do MongoDB)
async function gerarRelatorioComoTexto(registrosDoDia) {
    let acessosConcedidos = 0;
    let matriculasNegadas = [];

    registrosDoDia.forEach(registro => {
        if (registro.status === 'concedido') {
            acessosConcedidos++;
        } else if (registro.status.includes('negado')) {
            matriculasNegadas.push(registro.matricula);
        }
    });

    const dataString = new Date().toLocaleDateString('pt-BR');
    const relatorio = `
Relatório Diário - ${dataString}
----------------------------------
Total de Solicitações: ${registrosDoDia.length}
Acessos Concedidos: ${acessosConcedidos}
Matrículas Negadas: ${[...new Set(matriculasNegadas)].join(', ')}
----------------------------------
`;
    return relatorio;
}

// ----------------------------------------------------
// Middleware de Autenticação para Rotas Admin
// ----------------------------------------------------
function autenticarAdmin(req, res, next) {
    const senha = req.query.senha || (req.body && req.body.senha);

    if (senha === SENHA_ADMIN_GERAL) {
        return next(); // Senha correta, continua para a rota
    }

    res.status(401).send('Acesso não autorizado. Senha de administrador necessária.');
}

// ----------------------------------------------------
// Rotas da API (Atualizadas com Proteção)
// ----------------------------------------------------

// Middlewares globais
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// Rota para a página do funcionário (página inicial) - PÚBLICA
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para a página de administração
app.get('/admin', (req, res) => {
    // A proteção real acontece nas rotas da API que buscam os dados.
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Rota POST para verificar a matrícula - PÚBLICA
app.post('/api/verificar-acesso', async (req, res) => {
    const { matricula } = req.body;
    
    if (!matricula || typeof matricula !== 'string' || matricula.trim() === '') {
        return res.status(400).json({ mensagem: 'Matrícula inválida.' });
    }
    
    const funcionario = listaDeFuncionarios.find(f => f.matricula === matricula.trim());

    if (!funcionario) {
        await registrarAcesso(matricula, 'Desconhecido', 'negado');
        return res.status(401).json({ mensagem: 'Acesso negado. Matrícula não encontrada.' });
    }

    if (await jaAcessouHoje(matricula)) {
        await registrarAcesso(matricula, funcionario.nome, 'negado (acesso duplicado)');
        return res.status(403).json({ mensagem: `${funcionario.nome}, você já verificou seu acesso hoje.` });
    }

    await registrarAcesso(matricula, funcionario.nome, 'concedido');
    res.status(200).json({ mensagem: 'Acesso concedido. Bom apetite!', nome: funcionario.nome, status: 'aprovado' });
});

// Rota GET para buscar os registros de acesso - PROTEGIDA
app.get('/api/admin/relatorio', autenticarAdmin, async (req, res) => {
    const { data, busca, criterio } = req.query;
    const registros = await buscarRegistrosDoDia(data, busca, criterio);
    res.status(200).json(registros);
});

// Rota GET para baixar o relatório diário - PROTEGIDA
app.get('/api/admin/baixar-relatorio', autenticarAdmin, async (req, res) => {
    const dataParaRelatorio = req.query.data;
    const dataString = dataParaRelatorio || new Date().toISOString().split('T')[0];
    const nomeDoArquivo = `relatorio-diario-${dataString}.txt`;
    const caminhoDoArquivo = path.join(__dirname, 'relatorios', nomeDoArquivo);
    const registros = await buscarRegistrosDoDia(dataParaRelatorio);
    const relatorioTexto = await gerarRelatorioComoTexto(registros);

    const pastaRelatorios = path.join(__dirname, 'relatorios');
    if (!fs.existsSync(pastaRelatorios)) {
        fs.mkdirSync(pastaRelatorios);
    }
    fs.writeFileSync(caminhoDoArquivo, relatorioTexto, 'utf8');

    if (fs.existsSync(caminhoDoArquivo)) {
        res.download(caminhoDoArquivo, nomeDoArquivo, (erro) => {
            if (erro) {
                console.error("Erro ao baixar o arquivo:", erro);
                res.status(500).send("Erro ao tentar baixar o relatório.");
            }
        });
    } else {
        res.status(404).send("Relatório não encontrado. Verifique os logs do servidor.");
    }
});

// Rota POST para zerar o relatório - PROTEGIDA COM SENHA PRÓPRIA
app.post('/api/admin/zerar', async (req, res) => {
    const { senha } = req.body;

    if (senha !== SENHA_ADMIN_ZERAR_RELATORIO) {
        return res.status(401).send("Acesso negado. Senha incorreta.");
    }

    try {
        await Acesso.deleteMany({});
        res.status(200).send('Relatório diário zerado com sucesso!');
        console.log('Relatório diário zerado por acesso manual.');
    } catch (erro) {
        res.status(500).send(`Erro ao zerar o relatório: ${erro.message}`);
        console.error(`Erro ao zerar o relatório: ${erro.message}`);
    }
});