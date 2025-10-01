import { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: ReactNode
  title?: string
  currentView: string
  onViewChange: (view: string) => void
}

export default function Layout({ children, title, currentView, onViewChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={onViewChange} />
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header spacing */}
        <div className="lg:hidden h-16"></div>
        
        <main className="min-h-screen">
          {title && (
            <div className="bg-white shadow-sm border-b border-gray-200">
              <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
              </div>
            </div>
          )}
          
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}