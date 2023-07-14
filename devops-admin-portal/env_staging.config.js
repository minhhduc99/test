module.exports = {
  apps : [{
    name: 'firewall',
    script: './bin/www',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'staging',
	    PORT: 8080
    }
  }]
};
