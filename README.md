# Blockchain File Transfer - React Frontend

A secure file transfer system using blockchain authentication with a React frontend and Python backend.

## Features

- **Blockchain Authentication**: Secure client authentication using cryptographic signatures
- **File Transfer**: Upload and download files with client-specific access control
- **Client Management**: Manage blockchain clients and their access permissions
- **Real-time Dashboard**: Monitor system status and client activities
- **Smart Contract Integration**: Access control managed through Ethereum smart contracts

## Architecture

### Frontend (React)
- **Dashboard**: Overview of system status and client activities
- **File Transfer**: Interface for uploading/downloading files with specific clients
- **Client Management**: Manage blockchain clients, keys, and permissions

### Backend (Python - Unchanged)
- **Flask Auth Server**: OAuth-style authentication for connected cars
- **Blockchain Clients**: Web3-based clients for interacting with smart contracts
- **Resource Server**: Handles telemetry data requests with signature verification

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- Local Ethereum node (Ganache/Hardhat) running on localhost:8545

### Frontend Setup
1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Access the application at `http://localhost:5173`

### Backend Setup (Keep existing Python setup)
1. Start your local blockchain node on port 8545
2. Deploy smart contracts and update `contract.json`
3. Start the Flask auth server:
```bash
cd authserver
python -m flask run
```

4. Start the resource server:
```bash
python resource_server.py
```

## API Integration

The React frontend communicates with your existing Python backend through:

- **Authentication**: Flask auth server for OAuth-style client authentication
- **File Operations**: Resource server for telemetry data access
- **Blockchain**: Direct Web3 integration for smart contract interactions

## Security

- **Cryptographic Signatures**: All requests signed with client private keys
- **Nonce-based Authentication**: Prevents replay attacks
- **Smart Contract Access Control**: Blockchain-enforced permissions
- **End-to-end Encryption**: Secure file transfers

## Client Authentication Flow

1. Client requests nonce from resource server
2. Client signs nonce with private key
3. Client sends signed request with nonce and signature
4. Server verifies signature against blockchain address
5. Access granted/denied based on smart contract permissions

## Development

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Flask + Web3.py + Ethereum smart contracts
- **Database**: SQLite for auth server data
- **Blockchain**: Local Ethereum network for development

## File Structure

```
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Main application pages
│   ├── lib/            # Utilities and helpers
│   └── main.tsx        # Application entry point
├── authserver/         # Flask authentication server (unchanged)
├── *.py               # Python blockchain clients (unchanged)
└── contract.json      # Smart contract ABI and address
```

Your Python backend files remain completely unchanged and handle all blockchain operations, authentication, and file management.