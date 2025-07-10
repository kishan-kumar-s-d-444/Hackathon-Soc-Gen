from web3 import Web3
import json
from eth_account import Account
import time
import os
import subprocess
import tempfile

# Function to compile Solidity using solc command
def compile_solidity(source_code):
    with tempfile.NamedTemporaryFile(mode='w', suffix='.sol', delete=False) as temp_file:
        temp_file.write(source_code)
        temp_file.flush()
        
        try:
            # Run solc command
            process = subprocess.run(
                [
                    'solc',
                    '--optimize',
                    '--combined-json',
                    'abi,bin',
                    temp_file.name
                ],
                capture_output=True,
                text=True,
                check=True
            )
            
            # Parse the JSON output
            output = json.loads(process.stdout)
            contract_name = list(output['contracts'].keys())[0]
            contract_data = output['contracts'][contract_name]
            
            return {
                'abi': contract_data['abi'],  # The ABI is already a JSON string
                'bin': contract_data['bin']
            }
        finally:
            os.unlink(temp_file.name)

# Connect to local Geth node
w3 = Web3(Web3.HTTPProvider('http://localhost:8545'))

def create_client_account():
    """Create a new Ethereum account"""
    try:
        # Create new account using eth_account
        acct = Account.create()
        
        # Get the deployer account
        deployer = w3.eth.accounts[0]
        
        # Send some ETH to the new account
        tx_hash = w3.eth.send_transaction({
            'from': deployer,
            'to': acct.address,
            'value': w3.to_wei(1, 'ether'),
            'gas': 21000,
            'gasPrice': w3.eth.gas_price
        })
        w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return {
            'address': acct.address,
            'private_key': acct.key.hex()
        }
    except Exception as e:
        print(f"Error creating account: {str(e)}")
        return None

def main():
    try:
        # Check connection
        if not w3.is_connected():
            raise Exception("Not connected to Ethereum node")

        # Get the deployer account (first account)
        deployer = w3.eth.accounts[0]
        print(f"Using deployer account: {deployer}")
        
        # Get initial balance
        balance = w3.eth.get_balance(deployer)
        print(f"Initial deployer balance: {w3.from_wei(balance, 'ether')} ETH")
        
        if balance == 0:
            print("Deployer account has no ETH. Make sure your Geth node is running in dev mode.")
            return

        # Load all accounts
        with open('accounts.json', 'r') as f:
            clients = json.load(f)
        
        print("\nLoaded accounts:")
        for client_name in clients:
            print(f"Found {client_name} at {clients[client_name]['address']}")

        # Define endpoint permissions for Tesla clients
        endpoints = {}
        for client_name in clients:
            if client_name.startswith('tesla_'):
                # Define endpoints for each Tesla client
                endpoints[client_name] = f'/mercedes/telemetry/{client_name}_data,/mercedes/files/{client_name}/{client_name}_latest_update'

        # Save updated client accounts
        with open('accounts.json', 'w') as f:
            json.dump(clients, f, indent=4)
            print("Client accounts saved to accounts.json")

        # Compile contract
        print("\nCompiling contract...")
        with open('NonceValidator.sol', 'r') as file:
            contract_source = file.read()
        
        contract_interface = compile_solidity(contract_source)
        bytecode = contract_interface['bin']
        abi = contract_interface['abi']

        # Create contract instance
        Contract = w3.eth.contract(abi=abi, bytecode=bytecode)

        # Prepare constructor arguments for Tesla clients
        tesla_addresses = [clients[client]['address'] for client in clients if client.startswith('tesla_')]
        tesla_endpoints = [endpoints[client] for client in clients if client.startswith('tesla_')]

        # Deploy contract
        print("\nDeploying contract...")
        nonce = w3.eth.get_transaction_count(deployer)
        
        # Estimate gas
        gas_estimate = Contract.constructor(tesla_addresses, tesla_endpoints).estimate_gas({'from': deployer})
        print(f"Estimated gas: {gas_estimate}")
        
        # Build transaction
        transaction = Contract.constructor(tesla_addresses, tesla_endpoints).build_transaction({
            'from': deployer,
            'gas': gas_estimate,
            'gasPrice': w3.eth.gas_price,
            'nonce': nonce
        })
        
        # Send transaction
        tx_hash = w3.eth.send_transaction(transaction)
        print("Waiting for transaction to be mined...")
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Contract deployed at: {tx_receipt.contractAddress}")

        # Save contract info
        contract_data = {
            'address': tx_receipt.contractAddress,
            'abi': abi
        }

        with open('contract.json', 'w') as f:
            json.dump(contract_data, f, indent=4)
            print("Contract data saved to contract.json")

        print("\nDeployment complete!")

        # Fund Tesla client accounts
        for client_name, client_data in clients.items():
            if client_name.startswith('tesla_'):
                balance = w3.eth.get_balance(client_data['address'])
                if balance == 0:
                    tx_hash = w3.eth.send_transaction({
                        'from': w3.eth.accounts[0],
                        'to': client_data['address'],
                        'value': w3.to_wei(1, 'ether'),
                        'gas': 21000,
                        'gasPrice': w3.eth.gas_price
                    })
                    w3.eth.wait_for_transaction_receipt(tx_hash)
                    print(f"Funded {client_name} with 1 ETH")

    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()
