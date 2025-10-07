# WebCarros

## Descrição

Este é um projeto pessoal desenvolvido para fins estudantis, com o objetivo de permitir que usuários visualizem anúncios de vendas de veículos, publiquem seus próprios anúncios, entrem em contato com vendedores e favoritarem veículos de sua preferência.

O aplicativo é full-stack, com frontend em React com TypeScript e Tailwind CSS utilizando Vite, e backend em Node.js com Prisma ORM e MySQL.

## Funcionalidades

- Visualização de anúncios de veículos postados por outros usuários.
- Cadastro e login de usuários com validação segura.
- Criação, edição e exclusão de anúncios de veículos.
- Favoritamento de veículos com organização em grupos.
- Perfil do usuário para gerenciar anúncios pessoais.
- Contato com vendedores via detalhes do anúncio.
- Modelagem de dados para veículos, usuários, imagens e favoritos.

## Tecnologias Utilizadas

### Frontend
- React com TypeScript
- Vite (build tool)
- Tailwind CSS (estilização)
- Zod (validação de formulários)
- React Hook Form (gerenciamento de formulários)
- Resolvers para integração de validação

### Backend
- Node.js
- Prisma ORM
- MySQL (banco de dados)
- Multer (upload de imagens)
- Autenticação JWT
- Rotas protegidas para operações privadas

### Banco de Dados
<img width="886" height="680" alt="image" src="https://github.com/user-attachments/assets/8ed8f650-8a09-4bb6-9681-0cbd0732e6d2" />

- Tabelas: Users, Cars, CarImages, Favorites
- Relacionamentos: Um usuário possui múltiplos carros, imagens e favoritos; um carro pode ser favoritado por múltiplos usuários.

## Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- MySQL (instalado e rodando)
- Git
- Conta no GitHub para clonar o repositório

### Clonando o Projeto
1. Abra o terminal e execute o comando abaixo para clonar o repositório:
   git clone https://github.com/seu-usuario/webcarros.git
   Substitua `seu-usuario` pelo nome do seu usuário no GitHub.

2. Navegue até o diretório do projeto:
  cd webcarros


### Configuração do Backend
1. Crie um arquivo `.env` na raiz do backend (pasta `backend` ou similar) com as variáveis de ambiente:
DATABASE_URL="mysql://usuario:senha@localhost:3306/webcarros"
JWT_SECRET="sua-chave-secreta-jwt"
PORT=3001

Ajuste a URL do banco conforme sua configuração MySQL.

2. Instale as dependências do backend:
  cd backend
  npm install

3. Execute as migrações do Prisma para criar as tabelas:
  npx prisma migrate dev --name init
  

4. Inicie o servidor backend:
  npm run dev

O backend estará rodando em `http://localhost:3001`.

### Configuração do Frontend
1. No diretório raiz ou pasta `frontend`, instale as dependências:
  cd frontend
  npm install

2. Inicie o servidor de desenvolvimento:
   npm run dev

O frontend estará rodando em `http://localhost:5173` (padrão do Vite).

### Testando o Projeto
- Acesse `http://localhost:5173` no navegador.
- Use as rotas públicas para testar, como `GET /api/` para verificar se o backend está ativo.
- Para funcionalidades privadas, cadastre um usuário via `/api/register` e faça login.

## Páginas do Aplicativo

### 1. Página Inicial
<img width="886" height="424" alt="image" src="https://github.com/user-attachments/assets/cf7f6b01-bd60-4b8e-b736-1403b55fd751" />

Exibe uma lista de anúncios de carros postados por outros usuários, com filtros e busca por modelo ou localização.

### 2. Página de Login
<img width="886" height="425" alt="image" src="https://github.com/user-attachments/assets/c84d3a14-705a-4f75-9012-6dcea8ffe94b" />

Formulário de registro e login com validação usando Zod, resolvers e React Hook Form para garantir dados seguros.

### 3. Página do Anúncio do Veículo
<img width="886" height="719" alt="image" src="https://github.com/user-attachments/assets/6854af3d-62b2-4e52-854d-ec56082f3d97" />

Detalhes completos do veículo selecionado, incluindo imagens, preço, descrição e opção de contato com o vendedor.

### 4. Página do Perfil do Usuário
<img width="886" height="420" alt="image" src="https://github.com/user-attachments/assets/af03e5c0-1f19-47fa-9ece-9b1589224221" />

Mostra os anúncios de carros publicados pelo usuário logado, com opções de edição e exclusão.

### 5. Página de Criação de Anúncio
<img width="886" height="583" alt="image" src="https://github.com/user-attachments/assets/40022719-7f0f-417b-a3b1-49181e5c1f45" />

Formulário para criar um novo anúncio de veículo, com upload de até 10 imagens e validação via Zod, resolvers e React Hook Form.

### 6. Página de Carros Favoritados
<img width="886" height="426" alt="image" src="https://github.com/user-attachments/assets/1da942eb-49a3-4763-9029-196f1a781a36" />

Lista os veículos favoritados, organizados em grupos (ex: 2 carros em um grupo específico), com opções de visualização, remoção e renomeação de grupos.

## Endpoints da API

### Rotas Públicas
- `GET /` - Raiz do sistema: Retorna confirmação de acesso.
- `POST /register` - Criação de usuário.
- `POST /login` - Autenticação de usuário.
- `GET /list-car` - Lista todos os carros.
- `GET /list-car/id/:id` - Busca carro por ID.
- `GET /list-car/slug/:slug` - Busca carro por slug (incrementa visualizações).

### Rotas Privadas (Requer autenticação)
#### Usuários
- `GET /list-user` - Lista todos os usuários.
- `GET /list-user-id` - Busca usuário por ID.
- `PUT /update-user` - Atualiza dados do usuário.

#### Carros
- `POST /add-car` - Cria novo carro (com upload de imagens).
- `GET /list-car/my` - Lista carros do usuário logado.
- `PUT /update-car/id/:carId` - Atualiza carro (autorização do dono).
- `PATCH /delete-car/id/:carId` - Deleta carro (autorização do dono).
- `PATCH /update-status/id/:carId` - Atualiza status do carro (autorização do dono).

#### Imagens
- `GET /list-image/id/:id` - Busca imagem por ID.
- `POST /add-image/id/:carId` - Adiciona imagens a um carro (autorização do dono).
- `PATCH /update-image/id/:carId` - Atualiza imagens de um carro (autorização do dono).
- `DELETE /delete-image/car/:carId/img/:imgId` - Deleta imagem específica (autorização do dono).

#### Favoritos
- `POST /add-favorite-car/id/:carId` - Adiciona carro aos favoritos.
- `GET /list-favorite-car` - Lista todos os favoritos.
- `GET /list-favorite-car/id/:id` - Busca favoritos por ID.
- `GET /list-favorite-car/my` - Lista favoritos do usuário logado.
- `GET /list-favorite/name/:group` - Favoritos por grupo e usuário.
- `GET /list-favorite-formated/my` - Favoritos formatados com grupos para o usuário.
- `DELETE /delete-favorite-item/id/:id` - Remove item dos favoritos.
- `DELETE /delete-group-items/name/:group` - Deleta grupo e itens.
- `PATCH /update-group-name/name/:group` - Atualiza nome do grupo.

Para mais detalhes, consulte o código fonte nas pastas `backend/routes` e controladores correspondentes.

