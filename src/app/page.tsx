
'use client';

import React, {useState, useEffect, useCallback} from 'react';
import {Button} from "@/components/ui/button";
import {Plus, Minus, RotateCcw} from 'lucide-react';

interface PlayerPanelProps {
  player: number;
  life: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({player, life, onIncrement, onDecrement}) => {
  return (
    <div className="rounded-lg border p-4 bg-card text-card-foreground shadow-sm flex flex-col items-center justify-center aspect-square">
      <h2 className="text-lg font-semibold">Player {player}</h2>
      <p className="text-4xl font-bold my-4">{life}</p>
      <div className="flex gap-4">
        <Button onClick={onDecrement} variant="secondary" size="icon" className="w-12 h-12">
          <Minus className="h-6 w-6"/>
        </Button>
        <Button onClick={onIncrement} variant="secondary" size="icon" className="w-12 h-12">
          <Plus className="h-6 w-6"/>
        </Button>
      </div>
    </div>
  );
};

const STARTING_LIFE = 20;

export default function Home() {
  const [lifeTotals, setLifeTotals] = useState([STARTING_LIFE, STARTING_LIFE, STARTING_LIFE, STARTING_LIFE]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLifeTotals = localStorage.getItem('lifeTotals');
      if (storedLifeTotals) {
        setLifeTotals(JSON.parse(storedLifeTotals));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifeTotals', JSON.stringify(lifeTotals));
    }
  }, [lifeTotals]);

  const incrementLife = useCallback((playerIndex: number) => {
    setLifeTotals(prevTotals => {
      const newTotals = [...prevTotals];
      newTotals[playerIndex] += 1;
      return newTotals;
    });
  }, []);

  const decrementLife = useCallback((playerIndex: number) => {
    setLifeTotals(prevTotals => {
      const newTotals = [...prevTotals];
      newTotals[playerIndex] -= 1;
      return newTotals;
    });
  }, []);

  const resetLifeTotals = () => {
    setLifeTotals([STARTING_LIFE, STARTING_LIFE, STARTING_LIFE, STARTING_LIFE]);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid grid-cols-3 grid-rows-2 gap-4 w-full max-w-2xl p-4">
        <div className="col-span-1 row-span-1">
          <PlayerPanel
            player={1}
            life={lifeTotals[0]}
            onIncrement={() => incrementLife(0)}
            onDecrement={() => decrementLife(0)}
          />
        </div>
        <div className="col-start-3 col-span-1 row-span-1">
           <PlayerPanel
            player={2}
            life={lifeTotals[1]}
            onIncrement={() => incrementLife(1)}
            onDecrement={() => decrementLife(1)}
          />
        </div>
        <div className="col-span-1 row-start-2 row-span-1">
           <PlayerPanel
            player={3}
            life={lifeTotals[2]}
            onIncrement={() => incrementLife(2)}
            onDecrement={() => decrementLife(2)}
          />
        </div>
        <div className="col-start-3 col-span-1 row-start-2 row-span-1">
           <PlayerPanel
            player={4}
            life={lifeTotals[3]}
            onIncrement={() => incrementLife(3)}
            onDecrement={() => decrementLife(3)}
          />
        </div>
        <div className="col-start-2 row-start-1 row-span-2 flex items-center justify-center">
            <Button onClick={resetLifeTotals} className="w-24 h-24 rounded-full p-0">
                <RotateCcw className="w-10 h-10"/>
                <span className="sr-only">Reset All Players</span>
            </Button>
        </div>
      </div>
    </div>
  );
}
