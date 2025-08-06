module.exports = {
  apps: [{
    name: 'sollarity-api',
    script: 'server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      MONGO_URI: 'mongodb+srv://baleashvar:baleashvar@cluster0.jnyfsoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      BIRDEYE_API_KEY: 'c793467b749949be8bd5afce02114859',
      HELIUS_API_KEY: 'ed31e762-dd19-4f95-bc11-fd9a04505ea9',
      SMTP_HOST: 'smtp-relay.brevo.com',
      SMTP_PORT: '587',
      SMTP_USERNAME: '9415cb001@smtp-brevo.com',
      SMTP_PASSWORD: 'xsmtpsib-a41b81c9c644f69f6ab88b3013d7f35ed0525e320c029a08355d353daabea936-DyAO5h2z3JgB4wpE',
      SES_FROM_EMAIL: 'info@sollarity.xyz',
      ADMIN_EMAIL: 'sollarity1@gmail.com',
      FRONTEND_URL: 'https://sollarity.xyz',
      API_URL: 'https://api.sollarity.xyz'
    }
  }]
};