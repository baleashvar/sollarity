# Sollarity Installation Guide

This guide will help you set up and run the Sollarity project on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (v16+)
- Python (v3.8+)
- MongoDB (local installation or MongoDB Atlas account)

## Installation

### Option 1: Using the Installation Script

For Windows users, you can run the provided installation script:

1. Open Command Prompt
2. Navigate to the project directory
3. Run the installation script:
   ```
   install-dependencies.bat
   ```

### Option 2: Manual Installation

#### 1. Install Client Dependencies

```bash
cd client
npm install
```

#### 2. Install Server Dependencies

```bash
cd server
npm install
```

#### 3. Install Python Dependencies with Virtual Environment

```bash
cd workers

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Configuration

1. Copy the example environment file:
   ```bash
   copy config\.env.example config\.env
   ```

2. Edit the `.env` file with your specific configuration:
   - MongoDB connection string
   - API keys
   - Other environment variables

## Running the Application

### 1. Start MongoDB

If using a local MongoDB installation:
```bash
mongod
```

### 2. Start the Server

```bash
cd server
npm run dev
```

### 3. Start the Client

```bash
cd client
npm start
```

### 4. Run the Python Workers

```bash
cd workers

# Activate virtual environment if not already activated
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Run the scheduler
python scheduler.py
```

## Accessing the Application

Once everything is running, you can access the application at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Troubleshooting

- If you encounter any issues with MongoDB connection, make sure MongoDB is running and the connection string in your `.env` file is correct.
- For Python dependency issues, make sure you're using Python 3.8+ and have installed all dependencies from `requirements.txt`.
- For Node.js issues, ensure you're using Node.js v16+ and have installed all dependencies from both `client/package.json` and `server/package.json`.