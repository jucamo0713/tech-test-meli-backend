FROM node:22.14.0 AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ./nest-cli.json ./tsconfig.build.json ./tsconfig.json ./
COPY ./src ./src

RUN yarn build

FROM node:22.14.0-alpine AS runner

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --prod --frozen-lockfile && yarn cache clean

COPY --from=builder app/dist/ ./dist/

ARG PORT=3000
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["yarn", "start:prod"]