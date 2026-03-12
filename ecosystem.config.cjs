module.exports = {
  apps: [
    {
      name: 'movies-gateway',
      cwd: `${__dirname}/gateway`,
      script: 'java',
      args: '-jar target/movies-gateway.jar',
      interpreter: 'none',
      instances: 1,
      autorestart: true,
      restart_delay: 3000,
      max_restarts: 10,
      env: {
        SPRING_PROFILES_ACTIVE: 'prod',
      },
    },
    {
      name: 'movies-backend',
      cwd: __dirname,
      script: 'java',
      args: '-jar target/yingpingsxitong.jar',
      interpreter: 'none',
      instances: 1,
      autorestart: true,
      restart_delay: 3000,
      max_restarts: 10,
      env: {
        SPRING_PROFILES_ACTIVE: 'prod',
      },
    },
    {
      name: 'movies-frontend',
      cwd: `${__dirname}/frontend`,
      script: 'npm',
      args: 'run start',
      interpreter: 'none',
      instances: 1,
      autorestart: true,
      restart_delay: 3000,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
