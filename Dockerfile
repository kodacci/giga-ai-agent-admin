FROM nginx:1.31.9
COPY build/dist /usr/share/nginx/html
COPY distrib/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080 8081