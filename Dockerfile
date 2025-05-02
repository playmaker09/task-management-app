FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    zip unzip git curl npm nodejs libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Enable mod_rewrite for Laravel
RUN a2enmod rewrite

# Set working dir (Laravel base)
WORKDIR /var/www/html

# Copy source code
COPY . .

# Set Apache DocumentRoot to /var/www/html/public
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Install Composer
COPY --from=composer:2.5 /usr/bin/composer /usr/bin/composer

# Install Laravel deps
RUN composer install --no-dev --optimize-autoloader

# Build React and move it
RUN cd task-management-frontend && npm install && npm run build && cp -r dist/* ../public/

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Runtime command: symlink .env from secret and start Apache
CMD ln -sf /etc/secrets/.env .env && apache2-foreground

EXPOSE 80
