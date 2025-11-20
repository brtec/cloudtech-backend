# Usar uma imagem base do Node.js
FROM node:18-alpine

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar os arquivos de manifesto de pacotes
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar todo o código-fonte para o diretório de trabalho
COPY . .

# Gerar o Prisma Client
RUN npx prisma generate

# Compilar a aplicação TypeScript para JavaScript
RUN npm run build

# Expor a porta em que a aplicação irá rodar
EXPOSE 7001

# Comando para iniciar a aplicação quando o contêiner for executado
CMD ["node", "dist/src/main"]
