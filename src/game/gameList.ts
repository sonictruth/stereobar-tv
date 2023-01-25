// @ts-ignore
import tetris from '../assets/roms/tetris.nes';
// @ts-ignore
import smb from '../assets/roms/smb.nes';
// @ts-ignore
import smb3 from '../assets/roms/smb3.nes';
// @ts-ignore
import o1942 from '../assets/roms/1942.nes';
// @ts-ignore
import drmario from '../assets/roms/drmario.nes';

export default [
  {
    id: 'drmario',
    url: drmario,
    name: 'Dr.Mario',
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
    id: '1942',
    url: o1942,
    name: '1942',
  },
  {
    id: 'tctrl',
    url: smb3,
    name: 'Test Ctrl',
  },
];
