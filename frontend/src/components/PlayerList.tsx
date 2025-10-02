


interface Player {
  id: number;
  name: string;
  position: string;
  team: {
    name: string;
  };
  marketValue: number;
  rating: number;
  stats: {
    goals: number;
    assists: number;
    tackles: number;
    shotsOnTarget: number;
  };
}

interface PlayerListProps {
  players: Player[];
}

export default function PlayerList({ players }: PlayerListProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Jogadores</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Lista de Jogadores</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {players.map((player) => (
            <div key={player.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">{player.name}</h3>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {player.position}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">{player.team.name}</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">R$ {player.marketValue}</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">{player.rating}</span>
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(player.rating / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* Scout do jogador */}
                <div className="flex flex-wrap gap-2 text-xs text-gray-700 mt-1">
                  <span>Gols: <b>{player.stats.goals}</b></span>
                  <span>Assistências: <b>{player.stats.assists}</b></span>
                  <span>Desarmes: <b>{player.stats.tackles}</b></span>
                  <span>Chutes no gol: <b>{player.stats.shotsOnTarget}</b></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}