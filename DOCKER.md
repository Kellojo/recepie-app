# Docker Deployment Guide

This guide will help you deploy the Recipe App using Docker for easy self-hosting.

## Quick Start

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd recepie-app
   ```

2. **Run the deployment script:**

   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Access your app:**
   - App: http://localhost:8080
   - Admin Panel: http://localhost:8080/\_/

## Manual Deployment

### Prerequisites

- Docker
- Docker Compose

### Steps

1. **Create environment file:**

   ```bash
   cp .env.example .env
   # Edit .env and set your PB_ENCRYPTION_KEY
   ```

2. **Build and start:**
   ```bash
   docker-compose up -d
   ```

## Configuration

### Environment Variables

- `PB_ENCRYPTION_KEY`: 32-character encryption key for PocketBase
- `PORT`: Port to run the application (default: 8080)

### Data Persistence

- PocketBase data is stored in `./pb_data` directory
- This directory is mounted as a volume for data persistence

### Custom Hooks

- Place PocketBase hooks in `./pb_hooks` directory
- They will be automatically mounted into the container

## Production Deployment

### Security Considerations

1. **Change default encryption key**
2. **Use a reverse proxy** (nginx/traefik) with SSL
3. **Set up regular backups** of the `pb_data` directory
4. **Use Docker secrets** for sensitive data in production

### Example nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Restart the application
docker-compose restart

# Update the application
git pull
docker-compose build
docker-compose up -d

# Backup data
tar -czf backup-$(date +%Y%m%d).tar.gz pb_data/

# Restore data
tar -xzf backup-YYYYMMDD.tar.gz
```

## Troubleshooting

### Application won't start

1. Check logs: `docker-compose logs`
2. Verify port 8080 is available
3. Ensure pb_data directory exists and is writable

### Data not persisting

1. Check volume mounts in docker-compose.yml
2. Verify pb_data directory permissions

### Performance issues

1. Allocate more memory to Docker
2. Use SSD storage for pb_data
3. Consider using a dedicated database for large datasets
