
'use client';

import React, {useState, useEffect, useCallback} from 'react';
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
    <Card className={cn("p-4 flex flex-col items-center justify-center h-full w-full", rotated && "rotate-180")} style={{ backgroundColor: player.color }}>
      <h2 className="text-lg font-semibold">{player.name}</h2>
      <p className="text-4xl font-bold my-4">{player.life}</p>
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

  const renderPlayerPanels = () => {
    if (players.length <= 2) {
      return (
        <div className="flex flex-col gap-4 w-full max-w-sm">
          {players.map((player, index) => (
            <div key={player.id} className="aspect-square">
              <PlayerPanel
                key={player.id}
                player={player}
                onIncrement={() => updatePlayerLife(index, 1)}
                onDecrement={() => updatePlayerLife(index, -1)}
                rotated={index === 0}
              />
            </div>
          ))}
        </div>
      );
    }
    
    if (players.length === 3) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full max-w-2xl aspect-square">
          <div className="col-span-1 row-span-1">
            <PlayerPanel
              player={players[0]}
              onIncrement={() => updatePlayerLife(0, 1)}
              onDecrement={() => updatePlayerLife(0, -1)}
              rotated={true}
            />
          </div>
          <div className="col-span-1 row-span-1">
            <PlayerPanel
              player={players[1]}
              onIncrement={() => updatePlayerLife(1, 1)}
              onDecrement={() => updatePlayerLife(1, -1)}
              rotated={true}
            />
          </div>
          <div className="col-span-2 row-span-1">
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
        <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full max-w-2xl aspect-square">
            {players.map((player, index) => (
                <div key={player.id} className="col-span-1 row-span-1">
                    <PlayerPanel
                        player={player}
                        onIncrement={() => updatePlayerLife(index, 1)}
                        onDecrement={() => updatePlayerLife(index, -1)}
                        rotated={index < 2}
                    />
                </div>
            ))}
        </div>
    );
  };


  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
       <div className="absolute top-4 right-4">
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="w-6 h-6"/>
          </Button>
        </Link>
      </div>
      
      <div className="flex-grow flex items-center justify-center w-full">
        {renderPlayerPanels()}
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <Button onClick={resetLifeTotals} className="w-24 h-24 rounded-full p-0">
              <RotateCcw className="w-10 h-10"/>
              <span className="sr-only">Reset All Players</span>
          </Button>
      </div>
    </div>
  );
}
