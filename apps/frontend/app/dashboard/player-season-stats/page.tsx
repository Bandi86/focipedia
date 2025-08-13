'use client';

import { useState, useEffect } from 'react';
import { useGetAll, useCreate } from '../../../lib/hooks';

interface PlayerSeasonStats {
  id: number;
  season: string;
  appearances: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  shots: number;
  shotsOnTarget: number;
  passes: number;
  passAccuracy?: number;
  tackles: number;
  interceptions: number;
  dribbles: number;
  foulsCommitted: number;
  foulsSuffered: number;
  yellowCards: number;
  redCards: number;
  saves?: number;
  expectedGoals?: number;
  expectedAssists?: number;
  keyPasses?: number;
  playerId: number;
  teamId: number;
  leagueId: number;
  createdAt: string; // Add createdAt for sorting
}

interface Player {
  id: number;
  name: string;
}

interface Team {
  id: number;
  name: string;
}

interface League {
  id: number;
  name: string;
}

export default function PlayerSeasonStatsPage() {
  const [newSeason, setNewSeason] = useState('');
  const [newAppearances, setNewAppearances] = useState(0);
  const [newMinutesPlayed, setNewMinutesPlayed] = useState(0);
  const [newGoals, setNewGoals] = useState(0);
  const [newAssists, setNewAssists] = useState(0);
  const [newShots, setNewShots] = useState(0);
  const [newShotsOnTarget, setNewShotsOnTarget] = useState(0);
  const [newPasses, setNewPasses] = useState(0);
  const [newPassAccuracy, setNewPassAccuracy] = useState<number | ''>('');
  const [newTackles, setNewTackles] = useState(0);
  const [newInterceptions, setNewInterceptions] = useState(0);
  const [newDribbles, setNewDribbles] = useState(0);
  const [newFoulsCommitted, setNewFoulsCommitted] = useState(0);
  const [newFoulsSuffered, setNewFoulsSuffered] = useState(0);
  const [newYellowCards, setNewYellowCards] = useState(0);
  const [newRedCards, setNewRedCards] = useState(0);
  const [newSaves, setNewSaves] = useState<number | ''>('');
  const [newExpectedGoals, setNewExpectedGoals] = useState<number | ''>('');
  const [newExpectedAssists, setNewExpectedAssists] = useState<number | ''>('');
  const [newKeyPasses, setNewKeyPasses] = useState<number | ''>('');
  const [newPlayerId, setNewPlayerId] = useState<number | ''>('');
  const [newTeamId, setNewTeamId] = useState<number | ''>('');
  const [newLeagueId, setNewLeagueId] = useState<number | ''>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    data: playerSeasonStats,
    isLoading: isLoadingPlayerSeasonStats,
    error: playerSeasonStatsError,
  } = useGetAll<PlayerSeasonStats>('player-season-stats');
  const {
    data: players,
    isLoading: isLoadingPlayers,
    error: playersError,
  } = useGetAll<Player>('players');
  const { data: teams, isLoading: isLoadingTeams, error: teamsError } = useGetAll<Team>('teams');
  const {
    data: leagues,
    isLoading: isLoadingLeagues,
    error: leaguesError,
  } = useGetAll<League>('leagues');

  const createPlayerSeasonStatsMutation =
    useCreate<Omit<PlayerSeasonStats, 'id' | 'createdAt'>>('player-season-stats');

  useEffect(() => {
    if (createPlayerSeasonStatsMutation.isSuccess) {
      setMessage({ type: 'success', text: 'Player season stats added successfully!' });
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
    if (createPlayerSeasonStatsMutation.isError) {
      setMessage({
        type: 'error',
        text: `Error adding player season stats: ${createPlayerSeasonStatsMutation.error.message}`,
      });
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [
    createPlayerSeasonStatsMutation.isSuccess,
    createPlayerSeasonStatsMutation.isError,
    createPlayerSeasonStatsMutation.error,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    if (newPlayerId === '' || newTeamId === '' || newLeagueId === '') return;
    createPlayerSeasonStatsMutation.mutate(
      {
        season: newSeason,
        appearances: newAppearances,
        minutesPlayed: newMinutesPlayed,
        goals: newGoals,
        assists: newAssists,
        shots: newShots,
        shotsOnTarget: newShotsOnTarget,
        passes: newPasses,
        passAccuracy: newPassAccuracy || undefined,
        tackles: newTackles,
        interceptions: newInterceptions,
        dribbles: newDribbles,
        foulsCommitted: newFoulsCommitted,
        foulsSuffered: newFoulsSuffered,
        yellowCards: newYellowCards,
        redCards: newRedCards,
        saves: newSaves || undefined,
        expectedGoals: newExpectedGoals || undefined,
        expectedAssists: newExpectedAssists || undefined,
        keyPasses: newKeyPasses || undefined,
        playerId: newPlayerId as number,
        teamId: newTeamId as number,
        leagueId: newLeagueId as number,
      },
      {
        onSuccess: () => {
          setNewSeason('');
          setNewAppearances(0);
          setNewMinutesPlayed(0);
          setNewGoals(0);
          setNewAssists(0);
          setNewShots(0);
          setNewShotsOnTarget(0);
          setNewPasses(0);
          setNewPassAccuracy('');
          setNewTackles(0);
          setNewInterceptions(0);
          setNewDribbles(0);
          setNewFoulsCommitted(0);
          setNewFoulsSuffered(0);
          setNewYellowCards(0);
          setNewRedCards(0);
          setNewSaves('');
          setNewExpectedGoals('');
          setNewExpectedAssists('');
          setNewKeyPasses('');
          setNewPlayerId('');
          setNewTeamId('');
          setNewLeagueId('');
        },
      },
    );
  };

  const sortedPlayerSeasonStats = playerSeasonStats
    ? [...playerSeasonStats].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : [];

  if (isLoadingPlayerSeasonStats || isLoadingPlayers || isLoadingTeams || isLoadingLeagues)
    return <div>Loading...</div>;
  if (playerSeasonStatsError)
    return <div>Error loading player season stats: {playerSeasonStatsError.message}</div>;
  if (playersError) return <div>Error loading players: {playersError.message}</div>;
  if (teamsError) return <div>Error loading teams: {teamsError.message}</div>;
  if (leaguesError) return <div>Error loading leagues: {leaguesError.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Player Season Stats</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Player Season Stats</h2>
        <div className="mb-4">
          <label htmlFor="season" className="block text-sm font-medium text-gray-700">
            Season
          </label>
          <input
            type="text"
            id="season"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newSeason}
            onChange={(e) => setNewSeason(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="playerId" className="block text-sm font-medium text-gray-700">
            Player
          </label>
          <select
            id="playerId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newPlayerId}
            onChange={(e) => setNewPlayerId(parseInt(e.target.value))}
            required
          >
            <option value="">Select Player</option>
            {players?.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} (ID: {player.id})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="teamId" className="block text-sm font-medium text-gray-700">
            Team
          </label>
          <select
            id="teamId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newTeamId}
            onChange={(e) => setNewTeamId(parseInt(e.target.value))}
            required
          >
            <option value="">Select Team</option>
            {teams?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} (ID: {team.id})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="leagueId" className="block text-sm font-medium text-gray-700">
            League
          </label>
          <select
            id="leagueId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newLeagueId}
            onChange={(e) => setNewLeagueId(parseInt(e.target.value))}
            required
          >
            <option value="">Select League</option>
            {leagues?.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name} (ID: {league.id})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="appearances" className="block text-sm font-medium text-gray-700">
            Appearances
          </label>
          <input
            type="number"
            id="appearances"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newAppearances}
            onChange={(e) => setNewAppearances(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="minutesPlayed" className="block text-sm font-medium text-gray-700">
            Minutes Played
          </label>
          <input
            type="number"
            id="minutesPlayed"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newMinutesPlayed}
            onChange={(e) => setNewMinutesPlayed(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="goals" className="block text-sm font-medium text-gray-700">
            Goals
          </label>
          <input
            type="number"
            id="goals"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newGoals}
            onChange={(e) => setNewGoals(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="assists" className="block text-sm font-medium text-gray-700">
            Assists
          </label>
          <input
            type="number"
            id="assists"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newAssists}
            onChange={(e) => setNewAssists(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="shots" className="block text-sm font-medium text-gray-700">
            Shots
          </label>
          <input
            type="number"
            id="shots"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newShots}
            onChange={(e) => setNewShots(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="shotsOnTarget" className="block text-sm font-medium text-gray-700">
            Shots On Target
          </label>
          <input
            type="number"
            id="shotsOnTarget"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newShotsOnTarget}
            onChange={(e) => setNewShotsOnTarget(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="passes" className="block text-sm font-medium text-gray-700">
            Passes
          </label>
          <input
            type="number"
            id="passes"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newPasses}
            onChange={(e) => setNewPasses(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="passAccuracy" className="block text-sm font-medium text-gray-700">
            Pass Accuracy (Optional)
          </label>
          <input
            type="number"
            step="0.01"
            id="passAccuracy"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newPassAccuracy}
            onChange={(e) => setNewPassAccuracy(parseFloat(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="tackles" className="block text-sm font-medium text-gray-700">
            Tackles
          </label>
          <input
            type="number"
            id="tackles"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newTackles}
            onChange={(e) => setNewTackles(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="interceptions" className="block text-sm font-medium text-gray-700">
            Interceptions
          </label>
          <input
            type="number"
            id="interceptions"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newInterceptions}
            onChange={(e) => setNewInterceptions(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dribbles" className="block text-sm font-medium text-gray-700">
            Dribbles
          </label>
          <input
            type="number"
            id="dribbles"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newDribbles}
            onChange={(e) => setNewDribbles(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="foulsCommitted" className="block text-sm font-medium text-gray-700">
            Fouls Committed
          </label>
          <input
            type="number"
            id="foulsCommitted"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newFoulsCommitted}
            onChange={(e) => setNewFoulsCommitted(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="foulsSuffered" className="block text-sm font-medium text-gray-700">
            Fouls Suffered
          </label>
          <input
            type="number"
            id="foulsSuffered"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newFoulsSuffered}
            onChange={(e) => setNewFoulsSuffered(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="yellowCards" className="block text-sm font-medium text-gray-700">
            Yellow Cards
          </label>
          <input
            type="number"
            id="yellowCards"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newYellowCards}
            onChange={(e) => setNewYellowCards(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="redCards" className="block text-sm font-medium text-gray-700">
            Red Cards
          </label>
          <input
            type="number"
            id="redCards"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newRedCards}
            onChange={(e) => setNewRedCards(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="saves" className="block text-sm font-medium text-gray-700">
            Saves (Optional)
          </label>
          <input
            type="number"
            id="saves"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newSaves}
            onChange={(e) => setNewSaves(parseInt(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="expectedGoals" className="block text-sm font-medium text-gray-700">
            Expected Goals (Optional)
          </label>
          <input
            type="number"
            step="0.01"
            id="expectedGoals"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newExpectedGoals}
            onChange={(e) => setNewExpectedGoals(parseFloat(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="expectedAssists" className="block text-sm font-medium text-gray-700">
            Expected Assists (Optional)
          </label>
          <input
            type="number"
            step="0.01"
            id="expectedAssists"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newExpectedAssists}
            onChange={(e) => setNewExpectedAssists(parseFloat(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="keyPasses" className="block text-sm font-medium text-gray-700">
            Key Passes (Optional)
          </label>
          <input
            type="number"
            id="keyPasses"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newKeyPasses}
            onChange={(e) => setNewKeyPasses(parseInt(e.target.value))}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={createPlayerSeasonStatsMutation.isPending}
        >
          {createPlayerSeasonStatsMutation.isPending ? 'Adding...' : 'Add Player Season Stats'}
        </button>
        {message && (
          <p
            className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
          >
            {message.text}
          </p>
        )}
      </form>

      <h2 className="text-xl font-semibold mb-2">Existing Player Season Stats</h2>
      <ul className="space-y-2">
        {sortedPlayerSeasonStats.map((stats: PlayerSeasonStats) => (
          <li key={stats.id} className="p-4 border rounded-md shadow-sm">
            <p className="font-medium">Stats ID: {stats.id}</p>
            <p>Season: {stats.season}</p>
            <p>
              Player ID: {stats.playerId}, Team ID: {stats.teamId}, League ID: {stats.leagueId}
            </p>
            <p>
              Goals: {stats.goals}, Assists: {stats.assists}, Appearances: {stats.appearances}
            </p>
            <p className="text-xs text-gray-500">
              Created: {new Date(stats.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
