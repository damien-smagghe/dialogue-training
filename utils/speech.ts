const asyncSpeechSynthesis = (utterance: SpeechSynthesisUtterance) =>
  new Promise((resolve, reject) => {
    utterance.onend = resolve;
    utterance.onerror = reject;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.speak(utterance);
    }
  });

const speech = async ({
  text,
  voice,
  rate = 1,
  pitch = 1,
}: {
  text: string;
  voice: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
}) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.text = text;
  utterance.voice = voice;
  utterance.rate = rate;
  utterance.pitch = pitch;

  if ("speechSynthesis" in window) {
    await asyncSpeechSynthesis(utterance);
  }
};

export default speech
