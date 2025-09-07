
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, ArrowLeft } from 'lucide-react';
import type { Player } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const MAX_PLAYERS = 4;
const COLORS = [
  '#dc2626', // red-600
  '#2563eb', // blue-600
  '#16a34a', // green-600
  '#f59e0b', // amber-500
  '#9333ea', // purple-600
  '#db2777', // pink-600
];

const defaultPlayers = (startingLife: number): Player[] => [
  { id: 1, name: 'Player 1', life: startingLife, color: '#444444' },
  { id: 2, name: 'Player 2', life: startingLife, color: '#444444' },
];


export default function SettingsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [startingLife, setStartingLife] = useState(20);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPlayers = localStorage.getItem('players');
      const storedLife = localStorage.getItem('startingLife');
      const life = storedLife ? parseInt(storedLife, 10) : 20;

      setStartingLife(life);

      if (storedPlayers) {
        setPlayers(JSON.parse(storedPlayers));
      } else {
        setPlayers(defaultPlayers(life));
      }
    }
  }, []);

  const addPlayer = () => {
    if (players.length < MAX_PLAYERS) {
      setPlayers([...players, {
        id: players.length > 0 ? Math.max(...players.map(p => p.id)) + 1 : 1,
        name: `Player ${players.length + 1}`,
        life: startingLife,
        color: '#444444'
      }]);
    } else {
      toast({
        title: 'Maximum players reached',
        description: `You can only have up to ${MAX_PLAYERS} players.`,
        variant: 'destructive',
      })
    }
  };

  const removePlayer = (id: number) => {
    if (players.length > 1) {
        setPlayers(players.filter(p => p.id !== id));
    } else {
        toast({
            title: 'Minimum players required',
            description: `You must have at least 1 player.`,
            variant: 'destructive',
        });
    }
  };

  const handleNameChange = (id: number, newName: string) => {
    setPlayers(
      players.map(p => (p.id === id ? { ...p, name: newName } : p))
    );
  };

  const handleColorChange = (id: number, newColor: string) => {
    setPlayers(
      players.map(p => (p.id === id ? { ...p, color: newColor } : p))
    );
  };

  const saveSettings = () => {
    if (typeof window !== 'undefined') {
      const playersWithNewLife = players.map(p => ({ ...p, life: startingLife }));
      localStorage.setItem('players', JSON.stringify(playersWithNewLife));
      localStorage.setItem('startingLife', startingLife.toString());
    }
    toast({
        title: 'Settings Saved!',
    });
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
            <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Settings</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="starting-life">Starting Life</Label>
            <Input
              id="starting-life"
              type="number"
              value={startingLife}
              onChange={(e) => setStartingLife(parseInt(e.target.value, 10) || 0)}
              className="max-w-xs"
            />
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Players</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {players.map(player => (
            <div key={player.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg">
              <div className="flex-grow w-full">
                <Label htmlFor={`name-${player.id}`}>Player Name</Label>
                <Input
                  id={`name-${player.id}`}
                  value={player.name}
                  onChange={e => handleNameChange(player.id, e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="w-full sm:w-auto">
                <Label>Tile Color</Label>
                <div className="flex gap-2 mt-1">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(player.id, color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        player.color === color ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Set color to ${color}`}
                    />
                  ))}
                  <Input type="color" value={player.color} onChange={(e) => handleColorChange(player.id, e.target.value)} className="w-10 h-10 p-1" />
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removePlayer(player.id)} className="shrink-0">
                  <Trash2 className="w-5 h-5 text-destructive" />
              </Button>
            </div>
          ))}
          <div className="flex justify-center">
            <Button variant="outline" onClick={addPlayer} disabled={players.length >= MAX_PLAYERS}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Player
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 flex justify-end">
        <Button onClick={saveSettings}>Save and Go Back</Button>
      </div>
    </div>
  );
}
