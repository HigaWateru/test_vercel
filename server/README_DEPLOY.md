# Deploy Server Mau (json-server)

Server trong thu muc server/ dang dung json-server voi file du lieu db.json.

## Cach 1: Deploy nhanh len Render

1. Tao mot Web Service moi tren Render, ket noi repo nay.
2. Cau hinh:
- Root Directory: server
- Build Command: npm install
- Start Command: npx json-server --watch db.json --host 0.0.0.0 --port $PORT
3. Deploy va lay URL, vi du: https://your-server.onrender.com

## Cau hinh frontend (Vercel)

1. Vao Vercel Project Settings > Environment Variables.
2. Tao bien:
- Name: VITE_API_BASE_URL
- Value: https://your-server.onrender.com
3. Redeploy project frontend.

## Luu y

- Goi free tren Render co the ngu sau mot thoi gian khong dung.
- json-server dung db.json nen thich hop demo/mau, khong phu hop production that.
- Neu can du lieu ben vung, nen chuyen sang backend Node/Express + database (Postgres/MongoDB).
