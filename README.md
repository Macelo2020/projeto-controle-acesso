# Projeto: Sistema de Controle de Acesso ao Refeitório v2.0

## Descrição

Este projeto é um sistema de controle de acesso para o refeitório do Hospital São Vicente de Paulo, desenvolvido em Node.js. Ele utiliza um banco de dados MongoDB para registrar os acessos dos funcionários e um painel de administração para visualização e gerenciamento diário.

O sistema valida as matrículas dos funcionários a partir de um arquivo `matriculas.csv`, registra todas as tentativas de acesso (aprovadas ou negadas) no banco de dados e oferece uma interface segura para a administração.

## Funcionalidades

- **Verificação de Matrícula**: Libera ou nega o acesso com base em uma lista de funcionários.
- **Registro de Acessos**: Grava cada tentativa de acesso (matrícula, nome, status, data e hora) no MongoDB.
- **Painel de Administração Seguro**: Interface protegida por senha para visualizar o relatório diário de acessos.
- **Filtro por Data**: Permite buscar relatórios de dias específicos.
- **Exportação de Relatório**: Possibilidade de baixar o relatório completo do dia em formato `.txt`.
- **Limpeza Automática**: Os registros são zerados automaticamente todos os dias à meia-noite (fuso horário de São Paulo).
- **Limpeza Manual Segura**: Funcionalidade para zerar os registros diários manualmente, protegida por uma senha específica.

## Tecnologias Utilizadas

- **Backend**: Node.js com o framework Express.js.
- **Banco de Dados**: MongoDB (hospedado no MongoDB Atlas ou localmente).
- **ORM**: Mongoose para interação com o MongoDB.
- **Frontend**: HTML, CSS e JavaScript puro.
- **Agendamento de Tarefas**: `node-cron` para a limpeza diária do banco de dados.
- **Hospedagem**: Render.com (ou similar).
- **Controle de Versão**: Git e GitHub.

---

## Como Usar o Projeto

### Pré-requisitos

- Node.js e npm (ou yarn) instalados.
- Uma instância do MongoDB (local ou em um serviço como o MongoDB Atlas).

### Configuração

1.  **Clonar o Repositório**:
    ```bash
    git clone [https://github.com/Macelo2020/projeto-controle-acesso.git](https://github.com/Macelo2020/projeto-controle-acesso.git)
    ```

2.  **Entrar na Pasta do Projeto**:
    ```bash
    cd projeto-controle-acesso
    ```

3.  **Instalar as Dependências**:
    ```bash
    npm install
    ```

4.  **Configurar Variáveis de Ambiente**:
    Crie um arquivo chamado `.env` na raiz do projeto. Ele é fundamental para a segurança e configuração do sistema. Adicione as seguintes variáveis:

    ```env
    # String de conexão do seu banco de dados MongoDB
    MONGODB_URI=sua_string_de_conexao_do_mongodb

    # Senha para acessar o painel de administração e obter relatórios
    SEN