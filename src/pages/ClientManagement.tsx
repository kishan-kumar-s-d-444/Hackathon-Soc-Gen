import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Key, Shield, Activity, CheckCircle, XCircle } from 'lucide-react'

interface ClientData {
  id: string
  name: string
  address: string
  privateKey: string
  status: 'online' | 'offline'
  endpoint: string
  lastAccess: string
  totalRequests: number
}

// This data would normally come from your accounts.json and contract
const clientsData: ClientData[] = [
  {
    id: 'client1',
    name: 'Client 1',
    address: '0x8ba1f109551bD432803012645Hac136c2',
    privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617',
    status: 'online',
    endpoint: '/mercedes/telemetry/client1_data',
    lastAccess: '2024-01-10 14:30:00',
    totalRequests: 45
  },
  {
    id: 'client2', 
    name: 'Client 2',
    address: '0x7ab1e109551bD432803012645Hac136c3',
    privateKey: '0x5d0983a69102937d6231471b5dbb6204fe5129618',
    status: 'online',
    endpoint: '/mercedes/telemetry/client2_data',
    lastAccess: '2024-01-10 13:45:00',
    totalRequests: 32
  },
  {
    id: 'client3',
    name: 'Client 3', 
    address: '0x9cb1f109551bD432803012645Hac136c4',
    privateKey: '0x6e0a83a69102937d6231471b5dbb6204fe5129619',
    status: 'offline',
    endpoint: '/mercedes/telemetry/client3_data',
    lastAccess: '2024-01-09 16:20:00',
    totalRequests: 12
  },
  {
    id: 'client4',
    name: 'Client 4',
    address: '0xadb1f109551bD432803012645Hac136c5', 
    privateKey: '0x7f0b83a69102937d6231471b5dbb6204fe512961a',
    status: 'online',
    endpoint: '/mercedes/telemetry/client4_data',
    lastAccess: '2024-01-10 15:10:00',
    totalRequests: 67
  }
]

export function ClientManagement() {
  const [clients, setClients] = useState<ClientData[]>(clientsData)
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null)

  const testClientConnection = async (clientId: string) => {
    try {
      // This would integrate with your existing TelemetryClient class
      console.log(`Testing connection for ${clientId}`)
      
      // Simulate the authentication process from client.py
      const client = clients.find(c => c.id === clientId)
      if (!client) return

      // Step 1: Get nonce (simulated)
      const nonce = Math.random().toString(36).substring(7)
      console.log(`Received nonce: ${nonce}`)

      // Step 2: Sign nonce (would use Web3 in real implementation)
      console.log(`Signing nonce with private key: ${client.privateKey}`)

      // Step 3: Make authenticated request
      console.log(`Making request to: ${client.endpoint}`)

      // Update client status
      setClients(prev => prev.map(c => 
        c.id === clientId 
          ? { ...c, status: 'online' as const, lastAccess: new Date().toLocaleString() }
          : c
      ))

      alert(`Successfully connected to ${client.name}`)
    } catch (error) {
      console.error('Connection test failed:', error)
      alert('Connection test failed!')
    }
  }

  const revokeClientAccess = async (clientId: string) => {
    if (!confirm('Are you sure you want to revoke access for this client?')) {
      return
    }

    try {
      // This would integrate with your smart contract to revoke access
      console.log(`Revoking access for ${clientId}`)
      
      setClients(prev => prev.map(c => 
        c.id === clientId 
          ? { ...c, status: 'offline' as const }
          : c
      ))

      alert('Client access revoked successfully')
    } catch (error) {
      console.error('Failed to revoke access:', error)
      alert('Failed to revoke access!')
    }
  }

  const generateNewKeys = async (clientId: string) => {
    if (!confirm('Generate new keys for this client? This will invalidate the current keys.')) {
      return
    }

    try {
      // This would generate new blockchain keys
      const newAddress = '0x' + Math.random().toString(16).substring(2, 42)
      const newPrivateKey = '0x' + Math.random().toString(16).substring(2, 66)

      setClients(prev => prev.map(c => 
        c.id === clientId 
          ? { ...c, address: newAddress, privateKey: newPrivateKey }
          : c
      ))

      alert('New keys generated successfully. Please update the client configuration.')
    } catch (error) {
      console.error('Failed to generate new keys:', error)
      alert('Failed to generate new keys!')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Management</h1>
        <p className="text-muted-foreground">
          Manage blockchain clients and their access permissions
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Registered Clients</CardTitle>
            <CardDescription>
              Overview of all blockchain clients in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clients.map(client => (
                <div key={client.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{client.name}</h3>
                        <Badge variant={client.status === 'online' ? 'default' : 'secondary'}>
                          {client.status === 'online' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {client.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Address:</strong> {client.address}</p>
                        <p><strong>Endpoint:</strong> {client.endpoint}</p>
                        <p><strong>Last Access:</strong> {client.lastAccess}</p>
                        <p><strong>Total Requests:</strong> {client.totalRequests}</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testClientConnection(client.id)}
                      >
                        <Activity className="h-4 w-4 mr-1" />
                        Test Connection
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedClient(client)}
                      >
                        <Key className="h-4 w-4 mr-1" />
                        View Keys
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => revokeClientAccess(client.id)}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Revoke Access
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedClient && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>{selectedClient.name} - Cryptographic Keys</span>
              </CardTitle>
              <CardDescription>
                Manage blockchain keys for this client
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                <h4 className="font-medium mb-2">Blockchain Address</h4>
                <code className="text-sm break-all">{selectedClient.address}</code>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                <h4 className="font-medium mb-2">Private Key</h4>
                <code className="text-sm break-all text-red-600">{selectedClient.privateKey}</code>
                <p className="text-xs text-muted-foreground mt-1">
                  ⚠️ Keep this private key secure. Never share it publicly.
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => generateNewKeys(selectedClient.id)}
                >
                  Generate New Keys
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedClient(null)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}