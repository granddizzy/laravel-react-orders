FROM nginx:latest

COPY ./hosts/mysite.local.conf /etc/nginx/conf.d/mysite.local.conf

VOLUME /code

WORKDIR /code

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]