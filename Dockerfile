FROM php:8.2-apache

# Install PostgreSQL client and its PHP extensions
RUN apt-get update \
    && apt-get install -y libpq-dev wget \
    && docker-php-ext-install pdo pdo_pgsql

# Enable Apache modules
RUN a2enmod rewrite

# Set the working directory to /var/www/html
WORKDIR /var/www/html

# Copy the PHP code file in /app into the container at /var/www/html
COPY ./app/ .

# Download large point clouds from the internet
RUN wget http://labmgf.dica.polimi.it/pujob/storage/belvedere/2009_all/octree.bin
RUN mv octree.bin /var/www/html/potree/assets/pointclouds/2009_all/
