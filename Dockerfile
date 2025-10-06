# =============================
# Etapa 1: build da aplicação
# =============================
FROM node:20.10.0 AS builder

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de configuração do projeto
COPY package*.json ./

# Instala dependências (apenas de produção, se quiser mais leve)
RUN npm install

# Copia o restante do código
COPY . .

# Compila o código TypeScript
RUN npm run build


# =============================
# Etapa 2: imagem final
# =============================
FROM node:20.10.0

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia apenas o build e as dependências
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

# Instala apenas dependências necessárias para rodar
RUN npm install --omit=dev

# Define a variável de ambiente padrão
ENV NODE_ENV=production

# Expõe a porta padrão do NestJS
EXPOSE 3000

# Comando de inicialização
# CMD ["node", "dist/main.js"]
# COPY entrypoint.sh /usr/src/app/entrypoint.sh
COPY helper.js /usr/src/app/helper.js
# COPY src/config/typeorm.config.ts /usr/src/app/typeorm.config.ts

# RUN chmod +x /usr/src/app/entrypoint.sh

# CMD ["sh", "/usr/src/app/entrypoint.sh"]
CMD ["node", "dist/main.js"]
