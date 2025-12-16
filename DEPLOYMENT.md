# PakAlert Deployment Guide

This guide covers multiple deployment options for PakAlert.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB database set up (local or Atlas)
- [ ] API keys obtained (OpenWeather, Gemini)
- [ ] Code tested locally
- [ ] Build succeeds without errors
- [ ] Security review completed

---

## 🌐 Option 1: Vercel (Recommended for Quick Deploy)

### Backend Deployment on Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy Backend**
```bash
cd backend
vercel
```

4. **Set Environment Variables**
```bash
vercel env add MONGO_URI
vercel env add OPENWEATHER_KEY
vercel env add GEMINI_API_KEY
vercel env add SESSION_SECRET
vercel env add ADMIN_USER
vercel env add ADMIN_PASS
```

5. **Deploy to Production**
```bash
vercel --prod
```

### Frontend Deployment on Vercel

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Deploy**
```bash
vercel --prod
```

3. **Set Environment Variables**
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add:
  - `REACT_APP_API_BASE`: Your backend URL
  - `REACT_APP_SOCKET_URL`: Your backend URL
  - `REACT_APP_GEMINI_API_KEY`: Your Gemini API key

---

## 🔷 Option 2: Heroku

### Backend on Heroku

1. **Install Heroku CLI**
```bash
# Download from: https://devcenter.heroku.com/articles/heroku-cli
```

2. **Login**
```bash
heroku login
```

3. **Create App**
```bash
cd backend
heroku create pakalert-api
```

4. **Set Environment Variables**
```bash
heroku config:set MONGO_URI="your_mongodb_uri"
heroku config:set OPENWEATHER_KEY="your_key"
heroku config:set GEMINI_API_KEY="your_key"
heroku config:set SESSION_SECRET="your_secret"
heroku config:set ADMIN_USER="admin"
heroku config:set ADMIN_PASS="your_password"
heroku config:set NODE_ENV="production"
```

5. **Deploy**
```bash
git push heroku main
```

6. **Open App**
```bash
heroku open
```

### Frontend on Netlify

1. **Build**
```bash
cd frontend
npm run build
```

2. **Deploy via Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=build
```

3. **Or use Netlify Dashboard**
- Drag and drop the `build` folder
- Configure environment variables in Site Settings

---

## 🐳 Option 3: Docker

### Create Dockerfiles

**Backend Dockerfile:**
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

**Frontend Dockerfile:**
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: pakalert

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/pakalert
      - OPENWEATHER_KEY=${OPENWEATHER_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - SESSION_SECRET=${SESSION_SECRET}
      - ADMIN_USER=${ADMIN_USER}
      - ADMIN_PASS=${ADMIN_PASS}
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_BASE=http://localhost:5000/api
      - REACT_APP_SOCKET_URL=http://localhost:5000
    depends_on:
      - backend

volumes:
  mongo-data:
```

**Deploy with Docker Compose:**
```bash
docker-compose up -d
```

---

## ☁️ Option 4: AWS (EC2 + RDS)

### 1. Launch EC2 Instance
- Choose Ubuntu Server 22.04 LTS
- Instance type: t2.micro (free tier) or t2.small
- Configure security groups:
  - Port 22 (SSH)
  - Port 80 (HTTP)
  - Port 443 (HTTPS)
  - Port 5000 (Backend API)

### 2. Connect to EC2
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 3. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

### 4. Deploy Backend
```bash
# Clone repository
git clone https://github.com/yourusername/pakalert.git
cd pakalert/backend

# Install dependencies
npm install

# Create .env file
nano .env
# (Add your environment variables)

# Start with PM2
pm2 start server.js --name pakalert-api
pm2 save
pm2 startup
```

### 5. Deploy Frontend
```bash
cd ../frontend
npm install
npm run build

# Copy build to Nginx
sudo cp -r build/* /var/www/html/
```

### 6. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/default
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🗄️ Database Options

### Option 1: MongoDB Atlas (Recommended)

1. **Create Account**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Choose free tier (512MB)
   - Select region closest to your users
   - Create cluster

3. **Configure Network Access**
   - IP Whitelist: Add your IP or 0.0.0.0/0 (all IPs)

4. **Create Database User**
   - Create username and password
   - Grant read/write permissions

5. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Use in `MONGO_URI` environment variable

### Option 2: Local MongoDB
```bash
# Install MongoDB locally
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Linux
# (See AWS section above)

# Start MongoDB
mongod --dbpath /path/to/data
```

---

## 🔐 Security Best Practices

### 1. Environment Variables
- Never commit `.env` files
- Use different keys for dev/prod
- Rotate secrets regularly

### 2. HTTPS
- Always use SSL/TLS in production
- Redirect HTTP to HTTPS
- Use HSTS headers

### 3. Rate Limiting
- Already implemented in backend
- Monitor for abuse
- Adjust limits as needed

### 4. Authentication
- Use strong passwords
- Change default admin credentials
- Implement 2FA (future enhancement)

### 5. Database Security
- Use strong passwords
- Enable authentication
- Regular backups
- Network restrictions

### 6. API Keys
- Restrict API key permissions
- Monitor usage
- Set spending limits

---

## 📊 Monitoring & Logging

### PM2 Monitoring
```bash
pm2 monit
pm2 logs pakalert-api
pm2 restart pakalert-api
```

### Log Files
```bash
# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Application logs
pm2 logs
```

### MongoDB Monitoring
```bash
# Connect to MongoDB
mongo

# Check database status
use pakalert
db.stats()

# Check collection sizes
db.alerts.count()
db.reports.count()
```

---

## 🔄 CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./backend

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and Deploy
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

---

## 🧪 Testing Deployment

### 1. Health Checks
```bash
# Backend health
curl https://your-backend-url/api/health

# Frontend
curl https://your-frontend-url/
```

### 2. API Tests
```bash
# Weather API
curl "https://your-backend-url/api/weather?city=Lahore"

# Alerts API
curl "https://your-backend-url/api/alerts"
```

### 3. WebSocket Test
Use browser console:
```javascript
const socket = io('https://your-backend-url');
socket.on('connect', () => console.log('Connected!'));
```

---

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check connection string
echo $MONGO_URI

# Test connection
mongo $MONGO_URI
```

**2. API Returns 500 Error**
```bash
# Check logs
pm2 logs pakalert-api

# Restart service
pm2 restart pakalert-api
```

**3. Frontend Can't Connect to Backend**
- Check CORS settings
- Verify API_BASE URL
- Check network/firewall rules

**4. WebSocket Not Working**
- Nginx WebSocket configuration
- Check Socket.IO version compatibility
- Verify port is open

---

## 📈 Scaling Strategies

### Horizontal Scaling
- Load balancer (Nginx, HAProxy)
- Multiple backend instances
- Session store (Redis)

### Vertical Scaling
- Upgrade server resources
- Optimize database queries
- Implement caching

### Database Scaling
- MongoDB sharding
- Read replicas
- Connection pooling

---

## 💰 Cost Estimation

### Free Tier Options
- **Vercel**: Free for personal projects
- **MongoDB Atlas**: 512MB free
- **Netlify**: 100GB bandwidth/month free

### Paid Options (Monthly)
- **Heroku Hobby**: $7/month
- **AWS EC2 t2.micro**: ~$8/month
- **MongoDB Atlas M10**: ~$57/month
- **Domain**: ~$12/year

---

## 📞 Support

For deployment issues:
- Check documentation
- Review logs
- Search GitHub issues
- Contact support@pakalert.com

---

**Happy Deploying!** 🚀
