
// Audio utility functions
export const AUDIO_PATHS = {
  welcome: "https://notebooklm.google.com/notebook/aa197b04-c393-4043-b7f3-0b3443d2b153/audio",
  // Add more audio paths as needed
};

export const preloadAudio = (audioSrc: string): HTMLAudioElement => {
  const audio = new Audio(audioSrc);
  audio.load();
  return audio;
};
