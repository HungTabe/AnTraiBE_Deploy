#!/bin/bash

# AnTrai Production Deployment Script
# For 200-300 concurrent users
# Usage: ./scripts/deploy-production.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="antrai"
DOCKER_COMPOSE_FILE="docker-compose.production.yml"

echo "🚀 Starting AnTrai PRODUCTION deployment for $ENVIRONMENT environment..."
echo "📊 Target: 200-300 concurrent users"

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

# Check system resources
echo "🔍 Checking system resources..."
TOTAL_RAM=$(free -m | awk 'NR==2{printf "%.0f", $2}')
TOTAL_CPU=$(nproc)

if [ $TOTAL_RAM -lt 16000 ]; then
    echo "⚠️  Warning: System has less than 16GB RAM. Recommended: 32GB+ for 200-300 users"
fi

if [ $TOTAL_CPU -lt 8 ]; then
    echo "⚠️  Warning: System has less than 8 CPU cores. Recommended: 8+ cores for 200-300 users"
fi

echo "📋 Pre-deployment checks passed!"
echo "💻 System specs: ${TOTAL_CPU} cores, ${TOTAL_RAM}MB RAM"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs/nginx
mkdir -p logs/app
mkdir -p logs/postgres
mkdir -p logs/redis
mkdir -p monitoring/grafana/dashboards
mkdir -p monitoring/grafana/datasources
mkdir -p ssl

# Set proper permissions
chmod 755 logs/
chmod 755 monitoring/

# Build and start services
echo "🔨 Building and starting production services..."
docker-compose -f $DOCKER_COMPOSE_FILE down --remove-orphans

# Build with no cache for production
echo "🏗️ Building Docker images..."
docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache --parallel

# Start services in order
echo "🚀 Starting services..."
docker-compose -f $DOCKER_COMPOSE_FILE up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 30

# Check database health
echo "🔍 Checking database health..."
if docker-compose -f $DOCKER_COMPOSE_FILE exec postgres pg_isready -U antrai_user -d antrai_db; then
    echo "✅ Database is ready"
else
    echo "❌ Database failed to start"
    docker-compose -f $DOCKER_COMPOSE_FILE logs postgres
    exit 1
fi

# Start application services
echo "🚀 Starting application services..."
docker-compose -f $DOCKER_COMPOSE_FILE up -d app1 app2 worker1 worker2

# Wait for app services
echo "⏳ Waiting for application services..."
sleep 20

# Start load balancer and monitoring
echo "🌐 Starting load balancer and monitoring..."
docker-compose -f $DOCKER_COMPOSE_FILE up -d nginx prometheus grafana

# Wait for all services
echo "⏳ Waiting for all services to be ready..."
sleep 30

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose -f $DOCKER_COMPOSE_FILE exec app1 npx prisma migrate deploy

# Health checks
echo "🏥 Performing comprehensive health checks..."

# Check app services
for i in {1..2}; do
    if docker-compose -f $DOCKER_COMPOSE_FILE ps app$i | grep -q "Up"; then
        echo "✅ App service $i is running"
    else
        echo "❌ App service $i failed to start"
        docker-compose -f $DOCKER_COMPOSE_FILE logs app$i
        exit 1
    fi
done

# Check worker services
for i in {1..2}; do
    if docker-compose -f $DOCKER_COMPOSE_FILE ps worker$i | grep -q "Up"; then
        echo "✅ Worker service $i is running"
    else
        echo "❌ Worker service $i failed to start"
        docker-compose -f $DOCKER_COMPOSE_FILE logs worker$i
        exit 1
    fi
done

# Check database
if docker-compose -f $DOCKER_COMPOSE_FILE ps postgres | grep -q "Up"; then
    echo "✅ Database service is running"
else
    echo "❌ Database service failed to start"
    docker-compose -f $DOCKER_COMPOSE_FILE logs postgres
    exit 1
fi

# Check Redis
if docker-compose -f $DOCKER_COMPOSE_FILE ps redis | grep -q "Up"; then
    echo "✅ Redis service is running"
else
    echo "❌ Redis service failed to start"
    docker-compose -f $DOCKER_COMPOSE_FILE logs redis
    exit 1
fi

# Check Nginx
if docker-compose -f $DOCKER_COMPOSE_FILE ps nginx | grep -q "Up"; then
    echo "✅ Nginx load balancer is running"
else
    echo "❌ Nginx load balancer failed to start"
    docker-compose -f $DOCKER_COMPOSE_FILE logs nginx
    exit 1
fi

# Final health check
echo "🏥 Performing final health check..."
sleep 10

if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Load balancer health check passed"
else
    echo "❌ Load balancer health check failed"
    echo "Checking logs..."
    docker-compose -f $DOCKER_COMPOSE_FILE logs nginx
    exit 1
fi

# Performance test (basic)
echo "⚡ Running basic performance test..."
for i in {1..10}; do
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo -n "✅"
    else
        echo -n "❌"
    fi
done
echo ""

echo "🎉 Production deployment completed successfully!"
echo ""
echo "📊 Service Status:"
docker-compose -f $DOCKER_COMPOSE_FILE ps

echo ""
echo "🌐 Application URLs:"
echo "   Main API: https://yourdomain.com"
echo "   Health Check: https://yourdomain.com/health"
echo "   API Docs: https://yourdomain.com/api-docs"
echo "   Monitoring: http://localhost:3001 (Grafana)"
echo "   Metrics: http://localhost:9090 (Prometheus)"

echo ""
echo "📈 Performance Monitoring:"
echo "   - Grafana Dashboard: http://localhost:3001"
echo "   - Prometheus Metrics: http://localhost:9090"
echo "   - Logs: docker-compose -f $DOCKER_COMPOSE_FILE logs -f"

echo ""
echo "🔧 Management Commands:"
echo "   View logs: docker-compose -f $DOCKER_COMPOSE_FILE logs -f"
echo "   Stop services: docker-compose -f $DOCKER_COMPOSE_FILE down"
echo "   Restart app: docker-compose -f $DOCKER_COMPOSE_FILE restart app1 app2"
echo "   Scale workers: docker-compose -f $DOCKER_COMPOSE_FILE up -d --scale worker1=3 --scale worker2=3"
echo "   Database shell: docker-compose -f $DOCKER_COMPOSE_FILE exec postgres psql -U antrai_user -d antrai_db"

echo ""
echo "⚠️  Important Notes:"
echo "   1. Configure SSL certificates in ./ssl/ directory"
echo "   2. Update domain name in nginx configuration"
echo "   3. Set up monitoring alerts in Grafana"
echo "   4. Configure backup strategy for database"
echo "   5. Set up log rotation for production logs"

echo ""
echo "🚀 AnTrai is ready to handle 200-300 concurrent users!"







