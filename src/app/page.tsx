
'use client';

import React, {useState, useEffect, useCallback} from 'react';
import {Button} from "@/components/ui/button";
import {Plus, Minus} from 'lucide-react';

interface PlayerPanelProps {
  player: number;
  life: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({player, life, onIncrement, onDecrement}) => {
  return (
    <div className="rounded-lg border p-4 bg-card text-card-foreground shadow-sm flex flex-col items-center justify-center">
      <h2>Player {player}</h2>
      <p className="text-2xl font-bold">{life}</p>
      <div className="flex gap-2 mt-2">
        <Button onClick={onIncrement} variant="secondary">
          <Plus className="h-4 w-4"/>
        </Button>
        <Button onClick={onDecrement} variant="secondary">
          <Minus className="h-4 w-4"/>
        </Button>
      </div>
    </div>
  );
};

const STARTING_LIFE = 20;

const ResetButton: React.FC<{ onReset: () => void }> = ({ onReset }) => (
    <Button onClick={onReset} className="mt-4">
      Reset All Players
    </Button>
  );

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
    <>
      {lifeTotals.map((life, index) => (
        <PlayerPanel
          key={index}
          player={index + 1}
          life={life}
          onIncrement={() => incrementLife(index)}
          onDecrement={() => decrementLife(index)}
        />
      ))}
      <ResetButton onReset={resetLifeTotals} />
    </>
  );
}

    