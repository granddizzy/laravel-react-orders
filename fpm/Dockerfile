FROM php:8.2-fpm

COPY ./zz-docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf
COPY ./php.ini /usr/local/etc/php/conf.d/php-custom.ini

VOLUME /code

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    libmemcached-dev \
    libc-client-dev \
    libcurl4-openssl-dev \
    zlib1g-dev \
    zip \
    unzip \
    cron \
    nano

# Устанавливаем зависимости для npm (curl и Node.js)
RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    lsb-release \
    apt-transport-https \
    ca-certificates

# Добавляем репозиторий Node.js и устанавливаем его
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

# Обновление канала PECL
#RUN pecl channel-update pecl.php.net

# Установка и активация расширения memcache
RUN pecl install memcached && docker-php-ext-enable memcached

RUN pecl install xdebug \
  pecl install xdebug && docker-php-ext-enable xdebug


RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Разрешаем запуск Composer от суперпользователя
ENV COMPOSER_ALLOW_SUPERUSER 1

# Установка расширений PDO
RUN docker-php-ext-install pdo pdo_mysql

WORKDIR /code

CMD ["php-fpm"]