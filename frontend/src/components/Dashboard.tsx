import React from 'react';

type DashboardData = {
  totalPlayers: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  lastUpdated: string;
};

interface DashboardProps {
  data: DashboardData | null;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-gray-500">Carregando dados...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-600">Total de Jogadores</p>
          <p className="text-2xl font-bold text-gray-900">{data.totalPlayers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-600">Preço Médio</p>
          <p className="text-2xl font-bold text-gray-900">R$ {data.avgPrice}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-600">Preço Mínimo</p>
          <p className="text-2xl font-bold text-gray-900">R$ {data.minPrice}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-600">Preço Máximo</p>
          <p className="text-2xl font-bold text-gray-900">R$ {data.maxPrice}</p>
        </div>
      </div>
      <div className="mt-8">
        <p className="text-sm text-gray-500">Última atualização: {data.lastUpdated}</p>
      </div>
    </div>
  );
};

export default Dashboard;