# ☁️ PaperCode Bangladesh - AWS Production Hosting Guide

This guide walks you through deploying **PaperCode**, **Judge0 Server Sandbox**, and your **Database** on your AWS account for ultra-fast, low-latency performance in Bangladesh.

---

## 🏛️ Recommended AWS Architecture

```
[ Visitor / Student / Teacher (Bangladesh) ]
                     │  (HTTPS Port 443 ~38ms ping to Singapore)
                     ▼
           [ Nginx Reverse Proxy ]
          ┌──────────┴──────────┐
          ▼                     ▼
 [ Frontend & API Server ]  [ Judge0 Compiler Sandbox ]
   (Node.js + Express)        (Docker micro-sandboxes)
          │
          ▼
 [ NeonDB PostgreSQL ]
  (Serverless AWS ap-southeast-1)
```

- **Region**: **Singapore (`ap-southeast-1`)** (Lowest latency to Bangladesh, ~35–45ms ping).
- **Compute Instance**: **AWS EC2** or **AWS Lightsail** (`t3.small` / `t4g.small` or $5–$10/mo Lightsail instance with 2GB RAM / 2 vCPUs).

---

## 🚀 Step 1: Launch Your AWS EC2 Instance

1. Log into your **AWS Management Console**.
2. Go to **EC2** $\rightarrow$ Click **Launch Instance**:
   - **Name**: `papercode-production`
   - **OS Image**: **Ubuntu Server 24.04 LTS (HVM)**
   - **Instance Type**: `t3.small` (2 vCPUs, 2 GB RAM) or `t4g.small` (ARM Graviton)
   - **Key Pair**: Create or select an existing `.pem` key pair (e.g. `papercode-key.pem`)
3. **Network & Security Group**:
   - Check **Allow SSH traffic** from your IP (Port 22).
   - Check **Allow HTTP traffic from the internet** (Port 80).
   - Check **Allow HTTPS traffic from the internet** (Port 443).
4. **Storage**: Set **20 GB gp3** SSD.
5. Click **Launch Instance**.

---

## 💻 Step 2: Connect via SSH & Install Dependencies

Open your terminal and connect to your EC2 instance:

```bash
ssh -i "papercode-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>
```

Run the server setup commands:

```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20 LTS, Git, and Nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx certbot python3-certbot-nginx

# 3. Install PM2 (Process Manager) globally
sudo npm install -g pm2 tsx

# 4. Install Docker & Docker Compose (For Judge0 Sandbox)
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker ubuntu
```

*(Log out and log back in once with `exit` and `ssh` for Docker permissions to take effect).*

---

## 🐳 Step 3: Run Judge0 Sandbox on Your Server

Create a directory for Judge0 and start the compiler sandbox:

```bash
mkdir -p ~/judge0 && cd ~/judge0

# Download official Judge0 docker-compose
wget https://github.com/judge0/judge0/releases/download/v1.13.1/docker-compose.yml

# Start Judge0 in background
docker-compose up -d
```

Verify Judge0 is running:
```bash
curl http://localhost:2358/about
# Should return: {"version":"1.13.1", ...}
```

---

## 📦 Step 4: Clone & Build PaperCode

```bash
cd ~
git clone <YOUR_GITHUB_REPO_URL> papercode
cd papercode

# Install dependencies
npm install

# Build frontend production bundle
npm run build
```

Create your production `.env` file:
```bash
nano .env
```

Paste your production keys:
```ini
PORT=5000
NODE_ENV=production
CLIENT_URL=https://yourdomain.com

# 1. NeonDB PostgreSQL (Singapore ap-southeast-1)
DATABASE_URL=postgresql://user:password@ep-cool-fog-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

# 2. Gemini 2.0 Flash OCR Key (From Google AI Studio)
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-2.0-flash

# 3. Server-Side Judge0 (Local on the same instance)
JUDGE0_API_URL=http://localhost:2358

# 4. Security
JWT_SECRET=super_secret_jwt_production_papercode_bangladesh_2026
```

---

## ⚙️ Step 5: Start Backend with PM2 (Auto-Restart on Reboot)

```bash
# Start backend server with PM2
pm2 start "npx tsx server/index.ts" --name "papercode-api"

# Save PM2 state so it restarts automatically on server reboot
pm2 save
pm2 startup
```

---

## 🌐 Step 6: Configure Nginx & Free SSL (HTTPS)

Create an Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/papercode
```

Paste the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Serve Built Frontend SPA
    location / {
        root /home/ubuntu/papercode/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API Requests to Backend (Port 5000)
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable the site and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/papercode /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### Install Free SSL (Certbot Let's Encrypt):

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot will configure HTTPS certificates with automatic renewals.

---

## 🎉 Verification Checklist

- [x] **Frontend**: `https://yourdomain.com/` serves high-speed Vite SPA.
- [x] **API Health**: `https://yourdomain.com/api/health` returns `{"status":"ok"}`.
- [x] **Gemini OCR**: Calls `/api/ocr/extract` using Gemini 2.0 Flash vision model.
- [x] **Server Sandbox**: Calls `http://localhost:2358` Judge0 daemon to compile code.
- [x] **Database**: Connected to NeonDB PostgreSQL in Singapore region for low-latency queries.
