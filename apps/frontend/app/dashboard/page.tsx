import Link from 'next/link';

export default function DashboardPage() {
  const models = [
    'teams',
    'players',
    'leagues',
    'matches',
    'match-events',
    'player-match-stats',
    'player-season-stats',
    'transfers',
    'trophies',
    'player-trophies',
    'odds',
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data Entry Dashboard</h1>
      <nav>
        <ul className="space-y-2">
          {models.map((model) => (
            <li key={model}>
              <Link
                className="text-blue-500 hover:underline capitalize"
                href={`/dashboard/${model}`}
              >
                {model.replace('-', ' ')}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
