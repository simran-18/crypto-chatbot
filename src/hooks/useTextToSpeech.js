export const useTextToSpeech = () => {
  const synth = window.speechSynthesis;

  const speak = (text) => {
    if (!synth) return;
    synth.cancel(); // Stop previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    synth.speak(utterance);
  };

  const stopSpeaking = () => synth.cancel();

  return { speak, stopSpeaking };
};
