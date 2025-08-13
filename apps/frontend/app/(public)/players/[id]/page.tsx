import { getPlayerById } from '../../../../../lib/api';
import PlayerBio from '../../../../../components/public/PlayerBio';

interface PlayerDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function PlayerDetailsPage({ params }: PlayerDetailsPageProps) {
  const player = await getPlayerById(params.id);

  if (!player) {
    return <div className="container mx-auto p-4">Player not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Player Details</h1>
      <PlayerBio player={player} />
    </div>
  );
}
