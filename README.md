# 🍽️ Cantina School Website - Colégio Fantástico

<img src="/frontend/public/img/favicon.ico" alt="Logo" width="100" />

Bem-vindo ao repositório do **Cantina School Website**! Este projeto oferece uma solução completa para gerenciamento da cantina escolar no **Colégio Fantástico**, permitindo que estudantes comprem produtos e que a equipe administrativa gerencie o estoque, pagamentos e usuários de forma eficiente.

## ✨ Funcionalidades

- **Gerenciamento de Produtos da Cantina:**
  Estudantes podem visualizar, pesquisar e adquirir produtos. Administradores podem criar, editar e remover itens do estoque.
- **Carrinho de Compras:**
  Usuários autenticados adicionam produtos ao carrinho, removem itens e finalizam a compra, descontando automaticamente o saldo disponível.
- **Sistema de Permissões e Papéis de Usuário:**
  Diferentes papéis (administrador, financeiro, estudante) definem quem pode criar, editar ou aprovar ações, garantindo segurança e organização.
- **Afiliados e Folha de Pagamento (Payroll):**
  Permite configurar relações de afiliados, possibilitando integrar recargas e liquidações de valores via folha de pagamento de forma centralizada.
- **Recargas e Pagamentos:**
  O usuário pode recarregar seu saldo usando diversos métodos de pagamento (incluindo folha de pagamento). Solicitações de recarga podem precisar de aprovação de um administrador.
  _Em breve: Pagamentos via Pix!_
- **Despacho de Produtos:**
  Após a compra, a cantina pode marcar produtos como "a despachar" e depois "despachados", facilitando o controle de retirada.
- **Estatísticas e Exportações:**
  Possibilidade de extrair estatísticas sobre vendas, métodos de pagamento mais usados, produtos mais populares e histórico de recargas.
  Exportação de dados em formato Excel para análise e controle interno.
- **Gestão de Usuários:**
  Administradores podem criar, editar e remover usuários, atualizar senhas, e aplicar filtros de pesquisa. É possível identificar usuários com saldo disponível, saldo em folha de pagamento, entre outros.

## 🚀 Guia de Início Rápido

### 1. Crie o Arquivo `.env`

Defina um arquivo `.env` com as seguintes variáveis:

```bash
TIMEZONE=America/Maceio
WEBUI_PORT=8080
```

Se desejar expor externamente sem um proxy reverso, você pode alterar para `WEBUI_PORT=80`.

### 2. Subir a Aplicação com Docker

Certifique-se de ter o Docker instalado. Em seguida, execute:

```bash
docker-compose up -d
```

Isso iniciará o sistema completo:

- **Nginx:** Proxy reverso interno, garantindo que apenas a porta definida no `.env` seja exposta.
- **Next.js (Frontend):** Interface web do usuário.
- **Flask (Backend):** APIs internas, não expostas diretamente.

As credenciais do usuário inicial serão geradas em `credentials.txt`.

### 3. Deploy em Produção

Para produção, recomenda-se um proxy reverso externo ou simplesmente definir `WEBUI_PORT=80` no `.env`.

---

## 🤝 Contribuição

Faça um fork do projeto, crie uma branch de feature e envie um pull request. Sua contribuição é bem-vinda!

## 📬 Contato

- **GitHub:** [@felipeadeildo](https://github.com/felipeadeildo)
- **Email:** contato@felipeadeildo.com

Feliz desenvolvimento! 🎉

---

### Comandos Úteis

- **Verificar status dos contêineres:**
  ```bash
  docker compose ps
  ```
- **Parar os contêineres:**
  ```bash
  docker-compose down
  ```

---

![GitHub Stars](https://img.shields.io/github/stars/felipeadeildo/cantinacf?style=social)
![GitHub Forks](https://img.shields.io/github/forks/felipeadeildo/cantinacf?style=social)
![GitHub Issues](https://img.shields.io/github/issues/felipeadeildo/cantinacf)
![GitHub License](https://img.shields.io/github/license/felipeadeildo/cantinacf)