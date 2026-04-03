# README

## Running the App with Docker

### 1. Environment Setup

This app requires a Redis connection string.

You can provide it in **either of the following ways**:

---

### Option A — Using Docker Desktop (UI)

When running the container from Docker Desktop:

- Add an environment variable:
  Key: IOREDIS_HOST
  Value: redis://default:GunSg8teWDVrj6DOOLPJ2tDbFRSVa8YE@redis-19952.crce179.ap-east-1-2.ec2.redns.redis-cloud.com:29657

> (This is a dummy example string)

#### Steps:

1. Build the image:

```bash
docker build -t stackera-assignment .
```

2. Open Docker Desktop → run the container
3. Add the environment variable as shown above
4. Start the container

👉 No .env file is needed in this method

### Option B — Using .env file + Docker CLI

1. Create a .env file in the project root.
2. Include this - IOREDIS_HOST=<your_redis_connection_string> (connection string should look like this dummy link - IOREDIS_HOST=redis://default:GunSg8teWDVrj6DOOLPJ2tDbFRSVa8YE@redis-19952.crce179.ap-east-1-2.ec2.redns.redis-cloud.com:29657)
3. Then run

```bash
docker run -p 8000:8000 --env-file .env stackera-assignment
```

### Testing the WebSocket

Once the container is running:

1. Install wscat (if not already)

```bash
npm install -g wscat
```

2. Connect to WebSocket

```bash
wscat -c ws://localhost:8000/ws
```

3. Expected Result

You should see a continuous stream of data like:

```bash
{"symbol":"BTC/USDT","price":"...","change":"...","time":...}
```

## Rate Limiting

Rate limiting is applied **per IP address** when establishing a WebSocket connection.

### Rules

- Each IP can make up to **5 connection attempts**
- Time window: **10 minutes**
- After exceeding the limit:
  - Connection is rejected
  - Client receives:
    ```
    Too many requests
    ```

### How it works

- A Redis key is created per IP
- Each connection increments a counter
- The counter expires automatically after 10 minutes

### Notes

Default port: 8000
WebSocket endpoint: /ws
REST endpoint: http://localhost:8000/price
