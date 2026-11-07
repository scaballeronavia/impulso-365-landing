from nginx:alpine

RUN sed -i 's/listen       80;/listen       8000;/g' /etc/nginx/conf.d/default.conf

COPY . /usr/share/nginx/html

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]