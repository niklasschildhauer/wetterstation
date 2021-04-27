import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// Class to test the TTS from Firefox
export class SpeechAPIService {
  synth = window.speechSynthesis;
  constructor() {

  }
  init() {
  }

  getGermanVoice() : SpeechSynthesisVoice {
    let voices = this.synth.getVoices();
    return voices[4];
  }

  startOutput() {
    var utterThis = new SpeechSynthesisUtterance("Ich bin nur ein Versuch...");
    utterThis.voice = this.getGermanVoice();

    utterThis.pitch = 1;
    utterThis.rate = 1;

    this.synth.speak(utterThis);
  }
}
