import React from 'react'
import { Championship } from '../types/championships'

interface ResponsiveHeaderProps {
  title: string
  championship?: Championship
  actionButton?: React.ReactNode
}

export default function ResponsiveHeader({ title, championship, actionButton }: ResponsiveHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        {/* Title Section */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">
            {title}
          </h1>
          {championship && (
            <div className="mt-1 flex items-center space-x-2 text-sm text-gray-600">
              <span className="flex items-center">
                <span className="mr-1">{championship.logo}</span>
                {championship.name}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                Temporada {championship.season}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {actionButton && (
          <div className="flex-shrink-0">
            {actionButton}
          </div>
        )}

        {/* Status Indicator */}
        <div className="flex-shrink-0">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
            Sistema Online
          </span>
        </div>
      </div>

      {/* Championship Info Mobile */}
      {championship && (
        <div className="mt-3 sm:hidden">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {championship.country} • {championship.totalPlayers} jogadores
            </span>
            <span>
              Valor médio: R$ {championship.averageMarketValue.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}