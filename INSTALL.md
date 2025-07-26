# Sollarity Installation

## One-Command Install

```bash
sollarity.bat install
```

This installs:
- Node.js dependencies (client + server)
- Python dependencies (data collection + backup)

## Manual Installation

If the batch file doesn't work:

```bash
# Server dependencies
cd server
npm install

# Client dependencies  
cd ../client
npm install

# Python dependencies
cd ../workers
pip install -r requirements.txt
```

## Requirements

- Node.js 14+
- Python 3.8+
- MongoDB Atlas account

## Next Steps

1. Configure `config/.env` with your API keys
2. Run `sollarity.bat start` to launch the platform
3. Run `sollarity.bat scrape` to collect data

See HOW_TO_RUN.md for detailed setup instructions.