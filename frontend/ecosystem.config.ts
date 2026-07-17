module.exports = {
  apps: [
    {
      name: "app-3001",
      script: "node_modules/.bin/next",
      args: "start -p 3001",
      cwd: "/home/ubuntu/image-converter/frontend",
      env: { NODE_ENV: "production" },
      max_memory_restart: "300M",
    },
    {
      name: "app-3002",
      script: "node_modules/.bin/next",
      args: "start -p 3003",
      cwd: "/home/ubuntu/image-converter/frontend",
      env: { NODE_ENV: "production" },
      max_memory_restart: "300M",
    },
    {
      name: "app-3003",
      script: "node_modules/.bin/next",
      args: "start -p 4403",
      cwd: "/home/ubuntu/image-converter/frontend",
      env: { NODE_ENV: "production" },
      max_memory_restart: "300M",
    },
    {
      name: "worker",
      script: "npx",
      args: "tsx workers/index.ts",
      cwd: "/home/ubuntu/image-converter/frontend",
      env: { NODE_ENV: "production" },
      max_memory_restart: "300M",
    },
  ],
};