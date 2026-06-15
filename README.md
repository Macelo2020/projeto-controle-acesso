# 🍽️ Projeto: Controle de Acesso ao Refeitório IWGP

<p align="center">
  <img src="public/interface-mobile.png" alt="Interface do Controle de Acesso IWGP" width="320px" style="border-radius: 10px; box-shadow: 0px 4px 10px rgba(0,0,0,0.3);"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vers%C3%A3o-3.0.1-blue?style=for-the-badge" alt="Versão 3.0.1">
  <img src="https://img.shields.io/badge/Status-Online%20/%20Deployed-success?style=for-the-badge" alt="Status">
</p>

---

### 📝 Descrição do Projeto

Sistema **Full Stack** robusto desenvolvido para gerenciar, auditar e controlar o acesso de usuários ao refeitório hospitalar do **Hospital São Vicente**. A aplicação valida os colaboradores em tempo real por meio de matrícula, registra o histórico detalhado de acessos ("batidas") e oferece um painel administrativo completo para extração de dados estratégicos.

O sistema também conta com um módulo dinâmico para exibição do **cardápio da semana**, facilmente atualizável pela equipe via arquivo JSON estruturado.

---

## 🛠️ Tecnologias & Arquitetura

O projeto foi construído seguindo boas práticas de arquitetura distribuída na nuvem, dividindo-se em Front-end, Back-end (API REST) e Banco de Dados Não-Relacional:

* 🤖 **Back-End / API:** ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-skinnier&logo=nodedotjs&logoColor=white) — Servidor focado em alta performance para processamento das regras de negócio e validações.
* 💾 **Banco de Dados:** ![MongoDB](https://img.shields.io/badge/MongoDB%20Atlas-47A248?style=flat-skinnier&logo=mongodb&logoColor=white) — Armazenamento seguro de usuários, matrículas ativas e logs de acessos.
* 💻 **Front-End:** ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-skinnier&logo=javascript&logoColor=black) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-skinnier&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-skinnier&logo=css3&logoColor=white) — Interface responsiva, leve e otimizada para dispositivos móveis e coletores de dados.
* ☁️ **Hospedagem & Infra:** ![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-skinnier&logo=render&logoColor=black) — Infraestrutura PaaS com pipeline de **CI/CD (DevOps)** configurado via Auto-Deploy atrelado à branch `main`.

---

## ⚙️ Funcionalidades Principais

### 🌐 Área Pública (Otimizada para Totens/Mobile)
* **Validação Instantânea:** Tela de login limpa para digitação ou leitura de matrícula com retorno imediato de autorização.
* **Cardápio do Dia:** Exibição dinâmica do prato principal da refeição atual (ex: *Frango Guisado*), consumindo dados diretamente de `cardapio.json`.

### 🛡️ Painel Administrativo (Acesso Restrito)
* **Dashboard de Acessos:** Monitoramento em tempo real do volume de batidas por período.
* **Gerenciamento de Relatórios:**
    * *Pesquisa Avançada:* Filtros cirúrgicos por nome do colaborador, matrícula ou status do acesso.
    * *Data Export:* Download do histórico completo de auditoria formatado em arquivos **CSV**.
    * *Reset de Ciclo:* Função segura para zerar o relatório de batidas, preparando o ambiente para o próximo ciclo de contagem.

---

## 📈 Histórico de Versões (Evolução Arquitetural)

O desenvolvimento deste sistema demonstra uma clara trilha de maturidade de engenharia de software, evoluindo de um protótipo inicial baseado em ferramentas corporativas até uma arquitetura de microsserviços na nuvem:

* **`v3.0.1` [PATCH]** — Otimização técnica na rotina de atualização e renderização do cardápio semanal.
* **`v3.0.0` [MAJOR]** — Consolidação da interface do Painel Administrativo, melhoria drástica de UI/UX e implementação de filtros avançados.
* **`v2.2.0` [MINOR]** — Integração da funcionalidade de busca refinada na tabela administrativa (Nome/Matrícula/Status).
* **`v2.1.0` [MINOR]** — Desenvolvimento do motor de exportação de dados para relatórios em formato CSV.
* **`v2.0.0` [MAJOR]** — **Migração de Arquitetura:** O projeto deixou de ser um script utilitário para se tornar uma aplicação Full Stack hospedada no **Render** com banco de dados **MongoDB Atlas** em produção.
* **`v1.0.0` [MAJOR]** — Lançamento do primeiro protótipo web estático (HTML/CSS/JS) integrado ao ecossistema Netlify.
* **`v0.1.0` [PROTÓTIPO]** — Validação inicial de conceito (PoC) utilizando formulários inteligentes para coleta e auditoria de dados de campo.

---
<p align="center">
  Desenvolvido com foco em eficiência operacional por <b>BlueFrog Smart Solutions</b> 🐸
</p>
