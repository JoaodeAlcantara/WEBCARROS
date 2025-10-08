# WEBCARROS

> Plataforma completa para compra e venda de veículos online

## 📝 Sobre o Projeto

O **WEBCARROS** é uma aplicação web fullstack desenvolvida para fins educacionais que simula uma plataforma de anúncios automotivos. O projeto permite que usuários visualizem, publiquem e gerenciem anúncios de veículos, oferecendo funcionalidades como sistema de favoritos, busca avançada e contato direto entre vendedores e compradores.

## Funcionalidades

### Para Usuários
- **Autenticação Completa**: Registro e login de usuários
- **Visualização de Anúncios**: Navegação por veículos disponíveis
- **Sistema de Favoritos**: Salvar veículos de interesse em grupos personalizados
- **Contato Direto**: Comunicação com vendedores via telefone

### Para Vendedores
- **Dashboard Personalizado**: Gerenciamento completo dos anúncios
- **Cadastro de Veículos**: Interface intuitiva para publicar anúncios
- **Upload de Imagens**: Até 10 fotos por veículo
- **Controle de Status**: Disponível, vendido ou oculto
- **Estatísticas**: Visualizações e engajamento dos anúncios

## Tecnologias Utilizadas

### Frontend
- **React 19** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **React Hook Form + Zod** para validação
- **React Router** para navegação
- **Axios** para requisições HTTP
- **Swiper** para carrosséis de imagens
- **React Icons** para ícones
- **React Toastify** para notificações

### Backend
- **Node.js** com Express
- **Prisma ORM** para banco de dados
- **MySQL** como banco de dados
- **JWT** para autenticação
- **Bcrypt** para criptografia
- **Multer** para upload de arquivos
- **Rate Limiting** para segurança
- **CORS** para controle de acesso

## Arquitetura

O projeto segue uma arquitetura em camadas bem definida:

```
├── backend/
│   ├── src/
│   │   ├── controllers/     # Lógica de controle
│   │   ├── repositories/    # Acesso aos dados
│   │   ├── middlewares/     # Middlewares personalizados
│   │   ├── routes/          # Definição de rotas
│   │   └── utils/           # Funções utilitárias
│   └── prisma/             # Schema e migrações do banco
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── contexts/        # Contextos do React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── routes/         # Configuração de rotas
│   │   └── services/       # Serviços de API
```

## Como Executar

### Pré-requisitos
- Node.js 18+
- MySQL 8.0+
- npm ou yarn

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Variáveis de Ambiente
Crie um arquivo `.env` no backend com:
```env
DATABASE_URL="mysql://user:password@localhost:3306/webcarros"
JWT_SECRET="seu_jwt_secret_aqui"
```

### Página Inicial
![image](https://github.com/user-attachments/assets/e38b264b-7ede-4e7b-ab5e-043b365e5aa6)

### Login
![image](https://github.com/user-attachments/assets/c7cc89e7-9883-4989-8725-9d2fe30c6956)

### Detalhes do Veículo
![image](https://github.com/user-attachments/assets/7890e3e6-d69b-425f-af6c-ab982d4aa0a7)

### Dashboard do Vendedor
![image](https://github.com/user-attachments/assets/58ad2f51-42dd-4843-86c3-a09150953169)

### Cadastro de Veículo
![image](https://github.com/user-attachments/assets/0e569520-8d48-414a-99f1-c8fc90c9028c)

### Lista de Favoritos
![image](https://github.com/user-attachments/assets/5cff34a0-baed-48bb-a230-ca56aef8ea20)

## Recursos de Segurança

- **Autenticação JWT**: Tokens seguros para sessões
- **Validação de Dados**: Sanitização de entradas
- **Rate Limiting**: Proteção contra ataques de força bruta
- **Uploads Seguros**: Validação de tipos de arquivo
- **Transações de Banco**: Consistência de dados garantida

## Modelo de Dados

### Principais Entidades
- **Users**: Informações dos usuários
- **Cars**: Dados dos veículos
- **CarImages**: Imagens dos veículos
- **Favorites**: Sistema de favoritos por grupos

### Relacionamentos
- Um usuário pode ter múltiplos carros
- Um carro pode ter múltiplas imagens
- Usuários podem favoritar carros em grupos organizados

## Objetivos de Aprendizado

Este projeto foi desenvolvido com foco em:
- **Arquitetura Fullstack**: Separação clara entre frontend e backend
- **Boas Práticas**: Clean code, padrões de projeto e organização
- **Gerenciamento de Estado**: Context API e hooks customizados
- **Banco de Dados**: Relacionamentos complexos e otimização de queries
- **Autenticação e Autorização**: Implementação segura de sistema de login
- **Upload de Arquivos**: Manipulação e armazenamento de imagens

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.




