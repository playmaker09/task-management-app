# Use PHP image with Apache and extensions
FROM php:8.2-apache

# Install system deps
RUN apt-get update && apt-get install -y \
    zip unzip git curl npm nodejs libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy Laravel app
COPY . .

# Install Composer
COPY --from=composer:2.5 /usr/bin/composer /usr/bin/composer

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Build React (adjust path if needed)
RUN cd task-management-frontend && npm install && npm run build && cp -r dist/* ../public/

# Expose port 80
EXPOSE 80
