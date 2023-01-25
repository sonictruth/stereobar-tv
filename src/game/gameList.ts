
import tetris from '../assets/roms/tetris.nes';
import smb from '../assets/roms/smb.nes';
import drmario from '../assets/roms/drmario.nes';
import test from '../assets/roms/test.nes';
import zelda from '../assets/roms/zelda.nes';
import puzznic from '../assets/roms/puzznic.nes';
import kickle from '../assets/roms/kickle.nes';
import bomberman from '../assets/roms/bomberman.nes';
import battleship from '../assets/roms/battleship.nes';

export default [
  {
    id: 'battleship',
    url: battleship,
    name: 'Battleship',
  },
  {
    id: 'bomberman',
    url: bomberman,
    name: 'Bomberman',
  },
  {
    id: 'zelda',
    url: zelda,
    name: 'Zelda',
  },
  {
    id: 'drmario',
    url: drmario,
    name: 'Dr.Mario',
  },
  {
    id: 'kickle',
    url: kickle,
    name: 'Kickle Cubicle',
  },
  {
    id: 'puzznic',
    url: puzznic,
    name: 'Puzznic',
  },
  {
    id: 'tetris',
    url: tetris,
    name: 'Tetris',
  },
  {
    id: 'smb',
    url: smb,
    name: 'Super Mario',
  },
  {
    id: 'tctrl',
    url: test,
    name: 'Test Ctrl',
  },
];
