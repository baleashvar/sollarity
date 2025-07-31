module.exports = {
  apps: [{
    name: 'sollarity-api',
    script: 'server.js',
    cwd: '/var/www/sollarity/server',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: '/var/log/sollarity/err.log',
    out_file: '/var/log/sollarity/out.log',
    log_file: '/var/log/sollarity/combined.log',
    time: true
  }]
};