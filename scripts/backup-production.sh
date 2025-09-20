#!/bin/bash

# AnTrai Production Backup Script
# Automated backup strategy for 200-300 concurrent users

set -e

BACKUP_DIR="/opt/antrai/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

echo "💾 Starting AnTrai production backup..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
echo "🗄️ Backing up PostgreSQL database..."
docker-compose -f docker-compose.production.yml exec -T postgres pg_dump -U antrai_user -d antrai_db > $BACKUP_DIR/database_$DATE.sql

# Compress database backup
gzip $BACKUP_DIR/database_$DATE.sql
echo "✅ Database backup completed: database_$DATE.sql.gz"

# Redis backup
echo "🔴 Backing up Redis data..."
docker-compose -f docker-compose.production.yml exec -T redis redis-cli --rdb /data/dump_$DATE.rdb
docker cp antrai-redis:/data/dump_$DATE.rdb $BACKUP_DIR/
echo "✅ Redis backup completed: dump_$DATE.rdb"

# Application logs backup
echo "📝 Backing up application logs..."
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz logs/
echo "✅ Logs backup completed: logs_$DATE.tar.gz"

# Configuration backup
echo "⚙️ Backing up configuration files..."
tar -czf $BACKUP_DIR/config_$DATE.tar.gz \
    docker-compose.production.yml \
    nginx/ \
    postgres/ \
    redis/ \
    monitoring/ \
    .env
echo "✅ Configuration backup completed: config_$DATE.tar.gz"

# Cleanup old backups
echo "🧹 Cleaning up old backups (older than $RETENTION_DAYS days)..."
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.rdb" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
echo "✅ Old backups cleaned up"

# Backup summary
echo ""
echo "📊 Backup Summary:"
echo "   Database: database_$DATE.sql.gz"
echo "   Redis: dump_$DATE.rdb"
echo "   Logs: logs_$DATE.tar.gz"
echo "   Config: config_$DATE.tar.gz"
echo "   Total size: $(du -sh $BACKUP_DIR | cut -f1)"

echo "✅ Backup completed successfully!"







