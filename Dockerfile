FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    zip unzip git curl npm nodejs libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Enable Apache modules
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy Laravel source code
COPY . .

# Set Apache DocumentRoot to /public
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Allow Apache to follow symlinks (so /storage works)
RUN echo "<Directory /var/www/html/public>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>" > /etc/apache2/conf-available/laravel.conf \
    && a2enconf laravel

# Install Composer
COPY --from=composer:2.5 /usr/bin/composer /usr/bin/composer

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Build React and copy to Laravel's public folder
RUN cd task-management-frontend && npm install && npm run build && cp -r dist/* ../public/

# Set correct permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Expose web port
EXPOSE 80

# Start script (runs every time container starts)
CMD ["bash", "-c", "\
    ln -sf /etc/secrets/.env .env && \
    php artisan key:generate && \
    php artisan storage:link && \
    php artisan config:cache && \
    php artisan view:clear && \
    apache2-foreground"]
