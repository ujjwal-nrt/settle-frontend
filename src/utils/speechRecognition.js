import { Capacitor } from "@capacitor/core";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";

export async function requestSpeechPermission() {
  const current = await SpeechRecognition.checkPermissions();

  console.log("CURRENT SPEECH PERMISSION:", current);

  if (current.speechRecognition === "granted") {
    return true;
  }

  const requested = await SpeechRecognition.requestPermissions();

  console.log("REQUESTED SPEECH PERMISSION:", requested);

  return requested.speechRecognition === "granted";
}

export async function startSpeechRecognition() {
  if (!Capacitor.isNativePlatform()) {
    throw new Error("Voice input is available in the Android app only.");
  }

  const granted = await requestSpeechPermission();

  if (!granted) {
    throw new Error("Microphone permission is required for voice input.");
  }

  const result = await SpeechRecognition.start({
    language: "en-IN",
    maxResults: 1,
    prompt: "Tell me about your expense",
    partialResults: false,
    popup: false,
  });

  console.log("SPEECH RESULT:", JSON.stringify(result, null, 2));

  return result?.matches?.[0] || "";
}
