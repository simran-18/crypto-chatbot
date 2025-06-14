import { useState } from "react";

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  let recognition;

  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      setTranscript(event.results[0][0].transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };
  }

  const startRecording = () => {
    setTranscript("");
    setIsRecording(true);
    recognition?.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognition?.stop();
  };

  return { isRecording, transcript, startRecording, stopRecording };
};
