FROM node:16-alpine AS ui-build
WORKDIR /usr/src/app
COPY frontend/ ./frontend/
RUN cd frontend && yarn install && yarn build

FROM node:16-alpine AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/frontend/dist ./frontend/dist
COPY package.json yarn.lock ./api/
RUN cd api && yarn install
COPY . ./api/
RUN cd api && yarn build

EXPOSE 5000

CMD ["node", "./api/dist/index.js"]