
'use client';

import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Plus, Minus, RotateCcw, Settings} from 'lucide-react';
import type { Player } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PlayerPanelProps {
  player: Player;
  onIncrement: () => void;
  onDecrement: () => void;
  onNameChange: (name: string) => void;
  rotated?: boolean;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({player, onIncrement, onDecrement, onNameChange, rotated}) => {
  const textGlowStyle = {
    textShadow: `0 0 8px ${player.color}`,
    color: player.color,
  };
  const boxGlowStyle = {
    boxShadow: `0 0 8px ${player.color}`,
    borderColor: player.color
  };
  const buttonGlowStyle = {
    boxShadow: `0 0 8px ${player.color}`,
    borderColor: player.color,
    color: player.color
  };

  return (
    <Card className={cn("p-4 flex flex-col items-center justify-center h-full w-full bg-black border-2 border-primary shadow-[0_0_8px_theme(colors.primary)]", rotated && "transform rotate-180")}>
      <div className="border-2 rounded-md p-2 mb-2 bg-black" style={boxGlowStyle}>
        <Input
          type="text"
          value={player.name}
          onChange={(e) => onNameChange(e.target.value)}
          className="text-lg font-semibold bg-transparent border-none text-center focus-visible:ring-0 focus-visible:ring-offset-0 w-32"
          style={textGlowStyle}
        />
      </div>
      <div className="border-2 rounded-md p-2 bg-black" style={boxGlowStyle}>
        <div
          className="text-8xl font-bold bg-transparent border-none text-center w-48 h-24 flex items-center justify-center"
          style={textGlowStyle}
        >
          {player.life}
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <Button onClick={onDecrement} variant="outline" size="icon" className="w-12 h-12 bg-black border" style={buttonGlowStyle}>
          <Minus className="h-6 w-6"/>
        </Button>
        <Button onClick={onIncrement} variant="outline" size="icon" className="w-12 h-12 bg-black border" style={buttonGlowStyle}>
          <Plus className="h-6 w-6"/>
        </Button>
      </div>
    </Card>
  );
};

const defaultPlayers: Player[] = [
  { id: 1, name: 'Player 1', life: 20, color: '#444444' },
  { id: 2, name: 'Player 2', life: 20, color: '#444444' },
];

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [startingLife, setStartingLife] = useState(20);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPlayers = localStorage.getItem('players');
      const storedLife = localStorage.getItem('startingLife');
      const life = storedLife ? parseInt(storedLife, 10) : 20;

      setStartingLife(life);

      if (storedPlayers) {
        setPlayers(JSON.parse(storedPlayers));
      } else {
        const defaultWithLife = defaultPlayers.map(p => ({ ...p, life }));
        setPlayers(defaultWithLife);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && players.length > 0) {
      localStorage.setItem('players', JSON.stringify(players));
    }
  }, [players]);
  
  const updatePlayerLife = (playerIndex: number, lifeChange: number) => {
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      newPlayers[playerIndex] = { ...newPlayers[playerIndex], life: newPlayers[playerIndex].life + lifeChange };
      return newPlayers;
    });
  };

  const handlePlayerNameChange = (playerIndex: number, newName: string) => {
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      newPlayers[playerIndex] = { ...newPlayers[playerIndex], name: newName };
      return newPlayers;
    });
  };

  const resetLifeTotals = () => {
    setPlayers(prevPlayers => {
      const resetPlayers = prevPlayers.map(p => ({...p, life: startingLife}));
      return resetPlayers;
    });
  };

  const renderResetButton = () => (
    <div className="w-full flex items-center justify-center my-2">
      <Button onClick={resetLifeTotals} variant="outline" className="w-full max-w-sm h-16 bg-black border-2 border-primary shadow-[0_0_10px_theme(colors.primary)]">
          <RotateCcw className="w-8 h-8"/>
          <span className="ml-2 text-lg">Reset All Players</span>
      </Button>
    </div>
  );

  const renderPlayerPanels = () => {
    if (players.length <= 2) {
      return (
        <div className="flex flex-col gap-4 w-full max-w-sm">
          {players.length > 0 && (
            <div className="aspect-square">
              <PlayerPanel
                player={players[0]}
                onIncrement={() => updatePlayerLife(0, 1)}
                onDecrement={() => updatePlayerLife(0, -1)}
                onNameChange={(name) => handlePlayerNameChange(0, name)}
                rotated={true}
              />
            </div>
          )}
          
          {renderResetButton()}

          {players.length > 1 && (
             <div className="aspect-square">
                <PlayerPanel
                  player={players[1]}
                  onIncrement={() => updatePlayerLife(1, 1)}
                  onDecrement={() => updatePlayerLife(1, -1)}
                  onNameChange={(name) => handlePlayerNameChange(1, name)}
                  rotated={false}
                />
              </div>
          )}
        </div>
      );
    }
    
    if (players.length === 3) {
      return (
        <div className="flex flex-col items-center w-full max-w-2xl">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="col-span-1 aspect-square">
              <PlayerPanel
                player={players[0]}
                onIncrement={() => updatePlayerLife(0, 1)}
                onDecrement={() => updatePlayerLife(0, -1)}
                onNameChange={(name) => handlePlayerNameChange(0, name)}
                rotated={true}
              />
            </div>
            <div className="col-span-1 aspect-square">
              <PlayerPanel
                player={players[1]}
                onIncrement={() => updatePlayerLife(1, 1)}
                onDecrement={() => updatePlayerLife(1, -1)}
                onNameChange={(name) => handlePlayerNameChange(1, name)}
                rotated={true}
              />
            </div>
          </div>
          
          {renderResetButton()}
          
          <div className="w-full">
             <PlayerPanel
              player={players[2]}
              onIncrement={() => updatePlayerLife(2, 1)}
              onDecrement={() => updatePlayerLife(2, -1)}
              onNameChange={(name) => handlePlayerNameChange(2, name)}
              rotated={false}
            />
          </div>
        </div>
      );
    }

    // 4 players
    return (
      <div className="flex flex-col items-center w-full max-w-2xl">
        <div className="grid grid-cols-2 gap-4 w-full">
            {players.slice(0,2).map((player, index) => (
                <div key={player.id} className="aspect-square">
                    <PlayerPanel
                        player={player}
                        onIncrement={() => updatePlayerLife(index, 1)}
                        onDecrement={() => updatePlayerLife(index, -1)}
                        onNameChange={(name) => handlePlayerNameChange(index, name)}
                        rotated={true}
                    />
                </div>
            ))}
        </div>
        
        {renderResetButton()}

        <div className="grid grid-cols-2 gap-4 w-full">
           {players.slice(2,4).map((player, index) => (
                <div key={player.id} className="aspect-square">
                    <PlayerPanel
                        player={player}
                        onIncrement={() => updatePlayerLife(index + 2, 1)}
                        onDecrement={() => updatePlayerLife(index + 2, -1)}
                        onNameChange={(name) => handlePlayerNameChange(index + 2, name)}
                        rotated={false}
                    />
                </div>
            ))}
        </div>
      </div>
    );
  };


  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen p-4">
       <div className="absolute top-4 right-4 z-10">
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="w-6 h-6"/>
          </Button>
        </Link>
      </div>
      
      {renderPlayerPanels()}
    </main>
  );
}
