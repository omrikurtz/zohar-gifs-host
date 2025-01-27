import { useEffect, useState, useRef } from 'react'
import './App.css'

// Import all assets
import arsimImg from './assets/arsim.jpg'
import trafficImg from './assets/traffic.jpg'
import piguaImg from './assets/pigua.jpg'
import nahmanImg from './assets/nahman.jpg'
import homelessImg from './assets/homeless.jpg'
import constructionImg from './assets/construction.jpg'

import arsimSound from './assets/arsim.mp3'
import trafficSound from './assets/traffic.mp3'
import piguaSound from './assets/pigua.mp3'
import nahmanSound from './assets/nahman.mp3'
import homelessSound from './assets/homeless.mp3'
import constructionSound from './assets/construction.mp3'

import { PlayCircle, PauseCircle } from 'lucide-react'
import './App.css'

function ImageWithSound({ 
  imgSrc, 
  soundSrc, 
  title, 
  isAllPlaying,
  onPlayingChange 
}: {
  imgSrc: string;
  soundSrc: string;
  title: string;
  isAllPlaying: boolean;
  onPlayingChange: (isPlaying: boolean) => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(soundSrc);
    audioRef.current.loop = true;
    audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', () => setIsPlaying(false));
        audioRef.current.pause();
      }
    };
  }, [soundSrc]);

  const togglePlay = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    onPlayingChange(newPlayingState);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
        audioRef.current.volume = 1;
      } else {
        audioRef.current.volume = 0;
      }
    }
  }, [isPlaying])

  return (
    <div className="relative group">
      <div></div>
      <img
        className={`h-72 w-72 object-cover rounded-lg transition-transform duration-300
          ${isAllPlaying ? 'bounce-animation' : ''}`}
        src={imgSrc}
        alt={title}
      />
      <div className="absolute bottom-4 right-4">
        {isPlaying ? (
          <PauseCircle onClick={togglePlay} fill="black" size={40} className="text-white" />
        ) : (
          <PlayCircle onClick={togglePlay} fill="black" size={40} className="text-white" />
        )}
      </div>
    </div>
  );
}

function App() {
  const [playingCount, setPlayingCount] = useState(0);
  const totalSounds = 6; // Total number of available sounds

  const handlePlayingChange = (isPlaying: boolean) => {
    setPlayingCount(prev => isPlaying ? prev + 1 : prev - 1);
  };

  const isAllPlaying = playingCount === totalSounds;

  const columnItems = [
    [
      { img: arsimImg, sound: arsimSound, title: 'Arsim' },
      { img: trafficImg, sound: trafficSound, title: 'Traffic' },
      { img: piguaImg, sound: piguaSound, title: 'Pigua' },
    ],
    [
      { img: nahmanImg, sound: nahmanSound, title: 'Nahman' },
      { img: homelessImg, sound: homelessSound, title: 'Homeless' },
    ],
    [
      { img: constructionImg, sound: constructionSound, title: 'Construction' },
    ],
  ];

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-center gap-4">
        {columnItems.map((column, colIndex) => (
          <div
            key={colIndex}
            className={`flex flex-col justify-center gap-4 ${
              colIndex === 0 ? 'mt-0' : 
              colIndex === 1 ? 'mt-24' : 
              'mt-48'
            }`}
          >
            {column.map((item, itemIndex) => (
              <ImageWithSound
                key={itemIndex}
                imgSrc={item.img}
                soundSrc={item.sound}
                title={item.title}
                isAllPlaying={isAllPlaying}
                onPlayingChange={handlePlayingChange}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App