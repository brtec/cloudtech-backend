# 📘 CloudTech Platform

Bem-vindo à documentação oficial da **CloudTech Platform**. Este projeto é uma aplicação de backend completa, projetada para gerenciar empresas, membros e convites de forma eficiente e escalável.

## 1. Visão Geral da Plataforma

A plataforma é composta pelos seguintes serviços:

-   **Backend:** Uma API robusta construída com **NestJS**, seguindo os princípios do **Domain-Driven Design (DDD)** para garantir um código limpo, modular e escalável.
-   **Banco de Dados:** **PostgreSQL** para persistência de dados.
-   **Infraestrutura:** Ambiente totalmente containerizado com **Docker** e orquestrado com **Docker Compose**, garantindo consistência entre os ambientes de desenvolvimento e produção.

---

## 2. Tecnologias Utilizadas

### Backend
-   **Framework:** NestJS
-   **Linguagem:** TypeScript
-   **ORM:** Prisma
-   **Banco de Dados:** PostgreSQL
-   **Autenticação:** JWT (JSON Web Tokens) com Passport.js
-   **Testes:** Jest para testes unitários e E2E
-   **Documentação da API:** Swagger (OpenAPI)
-   **E-mail:** Nodemailer para envio de convites e notificações

### Infraestrutura
-   **Containerização:** Docker
-   **Orquestração:** Docker Compose

---

## 3. Configuração do Ambiente

### Pré-requisitos
-   Docker e Docker Compose instalados em sua máquina.

### Passos para Configuração

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-repositorio>
    cd <nome-do-repositorio>
    ```

2.  **Configure as Variáveis de Ambiente:**
    O backend requer um arquivo `.env` para carregar as configurações sensíveis. Crie um arquivo chamado `.env` na **raiz do projeto** e preencha com as seguintes variáveis:

    ```env
    # .env

    # Configuração do Banco de Dados
    DATABASE_URL="postgres://admin:admin123@postgres:5432/cloudtech_db"

    # Chave Secreta para JWT
    JWT_SECRET="supersecretkey"

    # Credenciais do Serviço de E-mail (SMTP)
    EMAIL_HOST="smtp.example.com"
    EMAIL_PORT="587"
    EMAIL_USER="seu-email@example.com"
    EMAIL_PASS="sua-senha"

    # URL do Frontend (para os links nos e-mails)
    FRONTEND_URL="http://localhost:3000"
    ```

    **Atenção:** As credenciais de e-mail e a `JWT_SECRET` devem ser alteradas para um ambiente de produção.

---

## 4. Como Rodar a Aplicação

A aplicação é totalmente gerenciada pelo Docker Compose. Para iniciar todos os serviços (backend e banco de dados), execute o seguinte comando na raiz do projeto:

```bash
sudo docker compose up --build
```

-   O comando `up` irá iniciar os serviços.
-   A flag `--build` forçará a reconstrução da imagem, garantindo que quaisquer alterações no código sejam aplicadas.

Após a execução, os serviços estarão disponíveis nos seguintes endereços:

-   **Backend:** `http://localhost:7001`
-   **Banco de Dados (PostgreSQL):** `localhost:5432`

---

## 5. Documentação da API (Swagger)

A API do backend possui uma documentação completa e interativa gerada com o Swagger. Para acessá-la, inicie a aplicação e navegue para:

**URL:** `http://localhost:7001/docs`

A partir da interface do Swagger, você pode:
-   Visualizar todas as rotas disponíveis.
-   Ver os DTOs (Data Transfer Objects) esperados para cada rota.
-   Testar as rotas diretamente do navegador (não se esqueça de adicionar o token JWT para rotas protegidas).

---

## 6. Como Executar os Testes

Os testes garantem a qualidade e a estabilidade do código do backend. O projeto conta com uma suíte completa de testes unitários com mocks para todos os serviços e controladores.

### Executando Testes Unitários

Para executar os testes unitários, que validam a lógica de negócio isoladamente utilizando mocks:

1.  **Instale as dependências (se ainda não tiver feito):**
    ```bash
    npm install
    ```

2.  **Rode os testes unitários:**
    ```bash
    npm test
    ```
    Este comando executará o Jest configurado para rodar todos os arquivos `.spec.ts` no diretório `test/unit`, cobrindo Services e Controllers.

### Executando Testes E2E (End-to-End)

Para executar os testes de integração/E2E:

```bash
npm run test:e2e
```
Certifique-se de que o ambiente de teste esteja configurado corretamente (pode exigir um banco de dados de teste ou configuração específica em `.env.test`).

---

## 7. Estrutura do Projeto (DDD)

O backend segue uma arquitetura baseada no **Domain-Driven Design (DDD)** para separar as responsabilidades e facilitar a manutenção.

```
src/modules/
├── auth/
│   ├── application/    # Lógica de negócio (Services, Use Cases)
│   ├── domain/         # Entidades e Interfaces
│   ├── infrastructure/ # Repositórios (interação com o banco de dados)
│   └── presentation/   # Controllers e DTOs (camada de API)
├── company/
├── membership/
├── invite/
└── email/
```

-   **Domain:** Contém as entidades e as interfaces, representando o núcleo do domínio.
-   **Application:** Orquestra a lógica de negócio, chamando os repositórios e serviços. Use Cases encapsulam fluxos específicos.
-   **Infrastructure:** Implementa os detalhes técnicos, como a comunicação com o banco de dados (Prisma) e serviços externos (Email).
-   **Presentation:** Expõe a lógica de negócio através de uma API REST (Controllers), lidando com DTOs e respostas HTTP.
