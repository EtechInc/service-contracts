FROM node:20-alpine AS build
WORKDIR /app

COPY service-contracts/package.json service-contracts/package-lock.json ./
COPY service-contracts/vendor ./vendor
RUN npm ci
COPY service-contracts/ .

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_PUBLIC_AZURE_CLIENT_ID
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
