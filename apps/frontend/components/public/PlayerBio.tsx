import React from 'react';

interface Player {
  id: number;
  name: string;
  country: string;
  dateOfBirth: string;
  position: string;
  // Add more player details as needed
}

interface PlayerBioProps {
  player: Player;
}

const PlayerBio: React.FC<PlayerBioProps> = ({ player }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-semibold mb-2">{player.name}</h2>
      <p>
        <strong>Country:</strong> {player.country}
      </p>
      <p>
        <strong>Date of Birth:</strong> {new Date(player.dateOfBirth).toLocaleDateString()}
      </p>
      <p>
        <strong>Position:</strong> {player.position}
      </p>
      {/* Add more player details here */}
    </div>
  );
};

export default PlayerBio;
