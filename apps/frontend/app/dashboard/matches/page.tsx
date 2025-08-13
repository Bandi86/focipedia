'use client';

import { useState, useEffect } from 'react';
import { useGetAll, useCreate } from '../../../lib/hooks';

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
  createdAt: string; // Add createdAt for sorting
}

interface Team {
  id: number;
  name: string;
  country: string;
  // Assuming team also has a leagueId if it belongs to a specific league
  leagueId?: number;
}

interface League {
  id: number;
  name: string;
  country: string;
}

export default function MatchesPage() {
  const [newMatchDate, setNewMatchDate] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<number | ''>('');
  const [newHomeTeamId, setNewHomeTeamId] = useState<number | ''>('');
  const [newAwayTeamId, setNewAwayTeamId] = useState<number | ''>('');
  const [newStadium, setNewStadium] = useState('');
  const [newRound, setNewRound] = useState('');
  const [newStatus, setNewStatus] = useState('Scheduled');
  const [newHomeScore, setNewHomeScore] = useState(0);
  const [newAwayScore, setNewAwayScore] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    data: matches,
    isLoading: isLoadingMatches,
    error: matchesError,
  } = useGetAll<Match>('matches');
  const { data: allTeams, isLoading: isLoadingTeams, error: teamsError } = useGetAll<Team>('teams');
  const {
    data: allLeagues,
    isLoading: isLoadingLeagues,
    error: leaguesError,
  } = useGetAll<League>('leagues');

  const createMatchMutation = useCreate<Omit<Match, 'id' | 'createdAt'>>('matches');

  useEffect(() => {
    if (createMatchMutation.isSuccess) {
      setMessage({ type: 'success', text: 'Match added successfully!' });
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
    if (createMatchMutation.isError) {
      setMessage({
        type: 'error',
        text: `Error adding match: ${createMatchMutation.error.message}`,
      });
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [createMatchMutation.isSuccess, createMatchMutation.isError, createMatchMutation.error]);

  // Derive unique countries from leagues
  const countries = Array.from(new Set(allLeagues?.map((league) => league.country))).sort();

  // Filter leagues by selected country
  const filteredLeagues = allLeagues
    ?.filter((league) => league.country === selectedCountry)
    .sort((a, b) => a.name.localeCompare(b.name));

  // Filter teams by selected league (or all teams if no league selected)
  const filteredTeams = allTeams
    ?.filter((team) => {
      if (selectedLeague) {
        return team.leagueId === selectedLeague; // Assuming team has a leagueId
      } else if (selectedCountry) {
        // If no league selected, but country is, show teams from that country's leagues
        const countryLeagues = allLeagues
          ?.filter((l) => l.country === selectedCountry)
          .map((l) => l.id);
        return countryLeagues?.includes(team.leagueId || -1); // Assuming team has a leagueId
      }
      return true; // Show all teams if no country or league selected
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // Reset league and team selections when country changes
  useEffect(() => {
    setSelectedLeague('');
    setNewHomeTeamId('');
    setNewAwayTeamId('');
  }, [selectedCountry]);

  // Reset team selections when league changes
  useEffect(() => {
    setNewHomeTeamId('');
    setNewAwayTeamId('');
  }, [selectedLeague]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    if (newHomeTeamId === '' || newAwayTeamId === '' || selectedLeague === '') return;
    createMatchMutation.mutate(
      {
        matchDate: newMatchDate,
        homeTeamId: newHomeTeamId as number,
        awayTeamId: newAwayTeamId as number,
        leagueId: selectedLeague as number,
        stadium: newStadium || undefined,
        round: newRound || undefined,
        status: newStatus,
        homeScore: newHomeScore,
        awayScore: newAwayScore,
      },
      {
        onSuccess: () => {
          setNewMatchDate('');
          setSelectedCountry('');
          setSelectedLeague('');
          setNewHomeTeamId('');
          setNewAwayTeamId('');
          setNewStadium('');
          setNewRound('');
          setNewStatus('Scheduled');
          setNewHomeScore(0);
          setNewAwayScore(0);
        },
      },
    );
  };

  const sortedMatches = matches
    ? [...matches].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  if (isLoadingMatches || isLoadingTeams || isLoadingLeagues) return <div>Loading...</div>;
  if (matchesError) return <div>Error loading matches: {matchesError.message}</div>;
  if (teamsError) return <div>Error loading teams: {teamsError.message}</div>;
  if (leaguesError) return <div>Error loading leagues: {leaguesError.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Matches</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Match</h2>
        <div className="mb-4">
          <label htmlFor="matchDate" className="block text-sm font-medium text-gray-700">
            Match Date
          </label>
          <input
            type="datetime-local"
            id="matchDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newMatchDate}
            onChange={(e) => setNewMatchDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="countrySelect" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <select
            id="countrySelect"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="leagueSelect" className="block text-sm font-medium text-gray-700">
            League
          </label>
          <select
            id="leagueSelect"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(parseInt(e.target.value))}
            disabled={!selectedCountry} // Disable if no country selected
            required
          >
            <option value="">Select League</option>
            {filteredLeagues?.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="homeTeamId" className="block text-sm font-medium text-gray-700">
            Home Team
          </label>
          <select
            id="homeTeamId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newHomeTeamId}
            onChange={(e) => setNewHomeTeamId(parseInt(e.target.value))}
            disabled={!selectedLeague} // Disable if no league selected
            required
          >
            <option value="">Select Home Team</option>
            {filteredTeams?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="awayTeamId" className="block text-sm font-medium text-gray-700">
            Away Team
          </label>
          <select
            id="awayTeamId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newAwayTeamId}
            onChange={(e) => setNewAwayTeamId(parseInt(e.target.value))}
            disabled={!selectedLeague} // Disable if no league selected
            required
          >
            <option value="">Select Away Team</option>
            {filteredTeams?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="stadium" className="block text-sm font-medium text-gray-700">
            Stadium (Optional)
          </label>
          <input
            type="text"
            id="stadium"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newStadium}
            onChange={(e) => setNewStadium(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="round" className="block text-sm font-medium text-gray-700">
            Round (Optional)
          </label>
          <input
            type="text"
            id="round"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newRound}
            onChange={(e) => setNewRound(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            required
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Live">Live</option>
            <option value="Finished">Finished</option>
            <option value="Canceled">Canceled</option>
            <option value="Postponed">Postponed</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="homeScore" className="block text-sm font-medium text-gray-700">
            Home Score
          </label>
          <input
            type="number"
            id="homeScore"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newHomeScore}
            onChange={(e) => setNewHomeScore(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="awayScore" className="block text-sm font-medium text-gray-700">
            Away Score
          </label>
          <input
            type="number"
            id="awayScore"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={newAwayScore}
            onChange={(e) => setNewAwayScore(parseInt(e.target.value))}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={createMatchMutation.isPending}
        >
          {createMatchMutation.isPending ? 'Adding...' : 'Add Match'}
        </button>
        {message && (
          <p
            className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
          >
            {message.text}
          </p>
        )}
      </form>

      <h2 className="text-xl font-semibold mb-2">Existing Matches</h2>
      <ul className="space-y-2">
        {sortedMatches.map((match: Match) => (
          <li key={match.id} className="p-4 border rounded-md shadow-sm">
            <p className="font-medium">Match ID: {match.id}</p>
            <p>Date: {new Date(match.matchDate).toLocaleString()}</p>
            <p>
              Teams: {match.homeTeamId} vs {match.awayTeamId}
            </p>
            <p>
              Score: {match.homeScore} - {match.awayScore}
            </p>
            <p>League: {match.leagueId}</p>
            <p>Status: {match.status}</p>
            <p className="text-xs text-gray-500">
              Created: {new Date(match.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
