
// Define audio paths with fallbacks for different formats
export const AUDIO_PATHS = {
  welcome: '/audio/welcome-audio.mp3',
  welcomeFallback: '/audio/welcome-audio.wav',
  blueprint: '/audio/mansa-musa-blueprint.mp3',
  blueprintFallback: '/audio/mansa-musa-blueprint.wav'
};

// Helper function to check which audio format is available
export const getAudioPath = (key: 'welcome' | 'blueprint'): string => {
  try {
    // Try to fetch the MP3 version first
    const mp3Path = AUDIO_PATHS[key];
    return mp3Path;
  } catch (e) {
    // If MP3 fails, fall back to WAV
    console.log(`Falling back to WAV for ${key} audio`);
    return AUDIO_PATHS[`${key}Fallback`];
  }
};
