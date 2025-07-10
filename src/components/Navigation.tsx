import { Link, useLocation } from 'react-router-dom'
import { Home, Upload, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold">Blockchain File Transfer</h1>
            <div className="flex space-x-4">
              <Link
                to="/"
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium",
                  isActive("/") 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Home size={16} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/transfer"
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium",
                  isActive("/transfer") 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Upload size={16} />
                <span>File Transfer</span>
              </Link>
              <Link
                to="/clients"
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium",
                  isActive("/clients") 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Users size={16} />
                <span>Clients</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}