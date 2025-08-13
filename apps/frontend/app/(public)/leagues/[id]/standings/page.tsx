import { getLeagueStandings } from '../../../../../../lib/api';
import StandingsTable from '../../../../../../components/public/StandingsTable';

interface LeagueStandingsPageProps {
  params: {
    id: string;
  };
}

export default async function LeagueStandingsPage({ params }: LeagueStandingsPageProps) {
  const standings = await getLeagueStandings(params.id);

  if (!standings) {
    return <div className="container mx-auto p-4">Standings not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">League Standings</h1>
      <StandingsTable standings={standings} />
    </div>
  );
}
