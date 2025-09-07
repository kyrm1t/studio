
'use client';

import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {Button} from "@/components/ui/button";
import {Plus, Minus, RotateCcw, Settings} from 'lucide-react';
import type { Player } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PlayerPanelProps {
  player: Player;
  onIncrement: () => void;
  onDecrement: () => void;
  rotated?: boolean;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({player, onIncrement, onDecrement, rotated}) => {
  return (
    <Card className={cn("p-4 flex flex-col items-center justify-center h-full w-full", rotated && "transform rotate-180")} style={{ backgroundColor: player.color }}>
      <h2 className="text-lg font-semibold bg-black px-2 py-1 rounded">{player.name}</h2>
      <p className="text-4xl font-bold my-4 bg-black px-3 py-1 rounded-md">{player.life}</p>
      <div className="flex gap-4">
        <Button onClick={onDecrement} variant="secondary" size="icon" className="w-12 h-12">
          <Minus className="h-6 w-6"/>
        </Button>
        <Button onClick={onIncrement} variant="secondary" size="icon" className="w-12 h-12">
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
                rotated={true}
              />
            </div>
            <div className="col-span-1 aspect-square">
              <PlayerPanel
                player={players[1]}
                onIncrement={() => updatePlayerLife(1, 1)}
                onDecrement={() => updatePlayerLife(1, -1)}
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
