import { Injectable } from '@angular/core';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class SpeechAPIService {
  synth = window.speechSynthesis;
  constructor() {

  }
  init() {
  }

  getVoice() : SpeechSynthesisVoice {
    let voices = this.synth.getVoices();
    return voices[4];
  }

  startOutput() {
    var utterThis = new SpeechSynthesisUtterance("Ich bin nur ein Versuch...");
    utterThis.voice = this.getVoice();

    utterThis.pitch = 1;
    utterThis.rate = 1;

    this.synth.speak(utterThis);
  }
}
