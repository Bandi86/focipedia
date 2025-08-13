import React from 'react';

interface Standing {
  teamName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface StandingsTableProps {
  standings: Standing[];
}

const StandingsTable: React.FC<StandingsTableProps> = ({ standings }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Team</th>
            <th className="py-2 px-4 border-b">Played</th>
            <th className="py-2 px-4 border-b">Wins</th>
            <th className="py-2 px-4 border-b">Draws</th>
            <th className="py-2 px-4 border-b">Losses</th>
            <th className="py-2 px-4 border-b">GF</th>
            <th className="py-2 px-4 border-b">GA</th>
            <th className="py-2 px-4 border-b">GD</th>
            <th className="py-2 px-4 border-b">Points</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((teamStanding, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="py-2 px-4 border-b">{teamStanding.teamName}</td>
              <td className="py-2 px-4 border-b">{teamStanding.played}</td>
              <td className="py-2 px-4 border-b">{teamStanding.wins}</td>
              <td className="py-2 px-4 border-b">{teamStanding.draws}</td>
              <td className="py-2 px-4 border-b">{teamStanding.losses}</td>
              <td className="py-2 px-4 border-b">{teamStanding.goalsFor}</td>
              <td className="py-2 px-4 border-b">{teamStanding.goalsAgainst}</td>
              <td className="py-2 px-4 border-b">{teamStanding.goalDifference}</td>
              <td className="py-2 px-4 border-b font-bold">{teamStanding.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsTable;
