import React from 'react'

interface ResponsiveCardProps {
  title: string
  children: React.ReactNode
  className?: string
  headerAction?: React.ReactNode
  icon?: string
  description?: string
}

export default function ResponsiveCard({ 
  title, 
  children, 
  className = '', 
  headerAction, 
  icon,
  description 
}: ResponsiveCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon && (
              <span className="text-xl">{icon}</span>
            )}
            <div>
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                {title}
              </h2>
              {description && (
                <p className="text-sm text-gray-600 mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
          {headerAction && (
            <div className="flex-shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6">
        {children}
      </div>
    </div>
  )
}