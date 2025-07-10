import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { Dashboard } from './pages/Dashboard'
import { FileTransfer } from './pages/FileTransfer'
import { ClientManagement } from './pages/ClientManagement'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transfer" element={<FileTransfer />} />
            <Route path="/clients" element={<ClientManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App