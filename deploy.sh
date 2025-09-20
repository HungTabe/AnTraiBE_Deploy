#!/bin/bash

# AnTrai Deployment Script
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="antrai"
DOCKER_COMPOSE_FILE="docker-compose.yml"

echo "🚀 Starting AnTrai deployment for $ENVIRONMENT environment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure your environment variables."
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed!"
    echo "Please install Docker Compose and try again."
    exit 1
fi

echo "📋 Pre-deployment checks passed!"

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f $DOCKER_COMPOSE_FILE down --remove-orphans
docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache
docker-compose -f $DOCKER_COMPOSE_FILE up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service health..."

# Check app service
if docker-compose -f $DOCKER_COMPOSE_FILE ps app | grep -q "Up"; then
    echo "✅ App service is running"
else
    echo "❌ App service failed to start"
    docker-compose -f $DOCKER_COMPOSE_FILE logs app
    exit 1
fi

# Check database service
if docker-compose -f $DOCKER_COMPOSE_FILE ps postgres | grep -q "Up"; then
    echo "✅ Database service is running"
else
    echo "❌ Database service failed to start"
    docker-compose -f $DOCKER_COMPOSE_FILE logs postgres
    exit 1
fi

# Check Redis service
if docker-compose -f $DOCKER_COMPOSE_FILE ps redis | grep -q "Up"; then
    echo "✅ Redis service is running"
else
    echo "❌ Redis service failed to start"
    docker-compose -f $DOCKER_COMPOSE_FILE logs redis
    exit 1
fi

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose -f $DOCKER_COMPOSE_FILE exec app npx prisma migrate deploy

# Seed database (optional)
if [ "$ENVIRONMENT" = "development" ]; then
    echo "🌱 Seeding database..."
    docker-compose -f $DOCKER_COMPOSE_FILE exec app npm run db:seed
fi

# Health check
echo "🏥 Performing health check..."
sleep 10

if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    echo "Checking logs..."
    docker-compose -f $DOCKER_COMPOSE_FILE logs app
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Service Status:"
docker-compose -f $DOCKER_COMPOSE_FILE ps

echo ""
echo "🌐 Application URLs:"
echo "   API: http://localhost:3000"
echo "   Health: http://localhost:3000/health"
echo "   Docs: http://localhost:3000/api-docs"

echo ""
echo "📝 Useful commands:"
echo "   View logs: docker-compose -f $DOCKER_COMPOSE_FILE logs -f"
echo "   Stop services: docker-compose -f $DOCKER_COMPOSE_FILE down"
echo "   Restart app: docker-compose -f $DOCKER_COMPOSE_FILE restart app"
echo "   Database shell: docker-compose -f $DOCKER_COMPOSE_FILE exec postgres psql -U antrai_user -d antrai_db"


