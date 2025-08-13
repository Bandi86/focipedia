import React from 'react';

interface Match {
  id: number;
  matchDate: string;
  homeTeamId: number;
  awayTeamId: number;
  leagueId: number;
  stadium?: string;
  round?: string;
  status: string;
  homeScore: number;
  awayScore: number;
  createdAt: string;
}

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-xl font-semibold mb-2">Match ID: {match.id}</h2>
      <p className="text-gray-600">Date: {new Date(match.matchDate).toLocaleString()}</p>
      <p className="text-gray-700">
        Teams: {match.homeTeamId} vs {match.awayTeamId}
      </p>
      <p className="text-gray-700">
        Score: {match.homeScore} - {match.awayScore}
      </p>
      <p className="text-gray-700">League ID: {match.leagueId}</p>
      {match.stadium && <p className="text-gray-700">Stadium: {match.stadium}</p>}
      {match.round && <p className="text-gray-700">Round: {match.round}</p>}
      <p className="text-gray-700">Status: {match.status}</p>
    </div>
  );
};

export default MatchCard;
