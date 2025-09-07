
'use client';

import React, {useState, useEffect, useCallback} from 'react';
import Link from 'next/link';
import {Button} from "@/components/ui/button";
import {Plus, Minus, RotateCcw, Settings} from 'lucide-react';
import type { Player } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface PlayerPanelProps {
  player: Player;
  onIncrement: () => void;
  onDecrement: () => void;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({player, onIncrement, onDecrement}) => {
  return (
    <Card className="p-4 flex flex-col items-center justify-center aspect-square" style={{ backgroundColor: player.color }}>
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

const STARTING_LIFE = 20;

const defaultPlayers: Player[] = [
  { id: 1, name: 'Player 1', life: STARTING_LIFE, color: '#444444' },
  { id: 2, name: 'Player 2', life: STARTING_LIFE, color: '#444444' },
];

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPlayers = localStorage.getItem('players');
      if (storedPlayers) {
        setPlayers(JSON.parse(storedPlayers));
      } else {
        setPlayers(defaultPlayers);
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
      const resetPlayers = prevPlayers.map(p => ({...p, life: STARTING_LIFE}));
      return resetPlayers;
    });
  };

  const getGridLayout = () => {
    switch (players.length) {
      case 1:
        return "grid-cols-1 grid-rows-1";
      case 2:
        return "grid-cols-2 grid-rows-1";
      case 3:
        return "grid-cols-3 grid-rows-1";
      case 4:
        return "grid-cols-2 grid-rows-2";
      default:
        return "grid-cols-1 grid-rows-1";
    }
  };


  return (
    <div className="relative flex items-center justify-center min-h-screen">
       <div className="absolute top-4 right-4">
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="w-6 h-6"/>
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full max-w-2xl p-4">
          {players.length > 0 && (
            <div className="col-span-1 row-span-1">
              <PlayerPanel
                player={players[0]}
                onIncrement={() => updatePlayerLife(0, 1)}
                onDecrement={() => updatePlayerLife(0, -1)}
              />
            </div>
          )}
          {players.length > 1 && (
            <div className="col-start-2 col-span-1 row-span-1">
               <PlayerPanel
                player={players[1]}
                onIncrement={() => updatePlayerLife(1, 1)}
                onDecrement={() => updatePlayerLife(1, -1)}
              />
            </div>
          )}
          {players.length > 2 && (
            <div className="col-span-1 row-start-2 row-span-1">
               <PlayerPanel
                player={players[2]}
                onIncrement={() => updatePlayerLife(2, 1)}
                onDecrement={() => updatePlayerLife(2, -1)}
              />
            </div>
          )}
          {players.length > 3 && (
            <div className="col-start-2 col-span-1 row-start-2 row-span-1">
               <PlayerPanel
                player={players[3]}
                onIncrement={() => updatePlayerLife(3, 1)}
                onDecrement={() => updatePlayerLife(3, -1)}
              />
            </div>
          )}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <Button onClick={resetLifeTotals} className="w-24 h-24 rounded-full p-0">
                  <RotateCcw className="w-10 h-10"/>
                  <span className="sr-only">Reset All Players</span>
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
