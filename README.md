# Projeto: Controle de Acesso ao Refeitório IWGP

> Versão Atual: 3.0.1

Este é um sistema Full Stack para gerenciar e controlar o acesso de usuários a um refeitório. O sistema valida os usuários por matrícula, registra o histórico de acessos ("batidas") e permite a administração completa desses dados através de um painel de controle.

O projeto também exibe o cardápio da semana para os usuários, sendo este facilmente atualizável através de um arquivo `cardapio.json`.

---

## ✨ Funcionalidades Principais

O sistema é dividido em duas frentes: a área pública (login e cardápio) e o painel administrativo.

### Área Pública
* **Tela de Login:** Validação de usuários por matrícula para permitir o acesso.
* **Exibição do Cardápio:** Mostra o cardápio atualizado da semana (lido a partir do `cardapio.json`).

### Painel Administrativo (Acesso Restrito)
* **Dashboard de Acessos:** Visualização em tempo real da quantidade total de "batidas" (acessos) no refeitório.
* **Gerenciamento de Relatórios:**
    * **Pesquisa Avançada:** Permite ao administrador filtrar os acessos por nome, matrícula ou status.
    * **Download de Relatórios:** Opção de baixar o histórico de acessos (em formato CSV).
    * **Zerar Relatório:** Funcionalidade para limpar os registros de batidas, iniciando um novo ciclo de contagem.
* **Layout Responsivo:** Interface de administração com design (UI/UX) aprimorado para fácil gerenciamento em diferentes dispositivos.

---

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza uma arquitetura moderna unindo Front-end, Back-end e Banco de Dados na nuvem.

* **Frontend:** HTML5, CSS3, JavaScript
* **Backend:** Node.js (servidor que processa as regras de negócio)
* **Banco de Dados:** MongoDB Atlas (usado para armazenar usuários, matrículas e registros de acesso)
* **Arquivo de Dados:** `cardapio.json` (usado para gerenciar o cardápio de forma simples)
* **Hospedagem (Cloud):** Render
* **CI/CD (DevOps):** O projeto está configurado com Auto-Deploy. Qualquer `git push` para a branch `main` no GitHub inicia automaticamente um novo deploy no Render.

---

## 🚀 Histórico de Versões (Evolução Arquitetural)

Este histórico documenta a evolução do projeto, desde um protótipo até uma aplicação Full Stack.

* **v3.0.1**
    * `[PATCH]` Atualização de rotina do cardápio da semana.
* **v3.0.0**
    * `[MAJOR]` Marca a versão estável do painel administrativo, consolidando todas as funcionalidades de pesquisa, download e o novo layout aprimorado (UI/UX).
* **v2.2.0**
    * `[MINOR]` Adição da funcionalidade de **pesquisa avançada** no painel (por nome, matrícula e status).
* **v2.1.0**
    * `[MINOR]` Adição da funcionalidade de **download do relatório** de acessos (CSV).
* **v2.0.0**
    * `[MAJOR]` **Evolução para Arquitetura Full Stack.** Migração da hospedagem para o **Render** e integração com **MongoDB Atlas**. Esta mudança permitiu a criação do **Painel Administrativo** inicial (contagem de batidas e "zerar relatório").
* **v1.0.0**
    * `[MAJOR]` **Nascimento da Aplicação Web.** Migração do protótipo (Google Forms) para uma aplicação web estática (HTML/CSS/JS), hospedada no **Netlify**. Esta versão continha a **tela de login** e validação de matrícula.
* **v0.1.0 (Protótipo)**
    * `[PROTÓTIPO]` Validação inicial do conceito utilizando um **Google Forms** para a coleta de dados (nome e matrícula).