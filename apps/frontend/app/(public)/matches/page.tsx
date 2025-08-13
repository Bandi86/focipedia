import Link from 'next/link';
import { getMatches } from '../../../lib/api';
import MatchCard from '../../../components/public/MatchCard';

export default async function MatchesPage() {
  const matches = await getMatches();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Matches</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match: any) => (
          <Link key={match.id} href={`/matches/${match.id}`}>
            <MatchCard match={match} />
          </Link>
        ))}
      </div>
    </div>
  );
}
