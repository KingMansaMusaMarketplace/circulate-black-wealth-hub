
// Audio utility functions
export const AUDIO_PATHS = {
  welcome: "/audio/welcome-audio.wav",
  // Add more audio paths as needed
};

export const preloadAudio = (audioSrc: string): HTMLAudioElement => {
  const audio = new Audio(audioSrc);
  audio.load();
  return audio;
};
