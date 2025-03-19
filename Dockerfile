FROM node:20 AS build

ARG VITE_BACKEND_URL=http://localhost:3001/api/v1
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

WORKDIR /build
COPY package.json package-lock.json ./

RUN npm install
COPY . .

RUN npm run build
RUN ls -l /build/dist

FROM nginx:alpine AS final

WORKDIR /usr/share/nginx/html
COPY --from=build /build/dist .