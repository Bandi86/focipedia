import { getMatchById } from '../../../../../lib/api';
import MatchCard from '../../../../../components/public/MatchCard';

interface MatchDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function MatchDetailsPage({ params }: MatchDetailsPageProps) {
  const match = await getMatchById(params.id);

  if (!match) {
    return <div className="container mx-auto p-4">Match not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Match Details</h1>
      <MatchCard match={match} />
    </div>
  );
}
