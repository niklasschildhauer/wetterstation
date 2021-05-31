import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SpeechAPIService {
  synth = window.speechSynthesis;

  constructor() {}

  init() {}

  getGermanVoice() : SpeechSynthesisVoice {
    let voices = this.synth.getVoices();
    return voices[4];
  }

  startOutput(text: string) {
    var utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = "de-DE"
    utterThis.pitch = 1;
    utterThis.rate = 1;

    this.synth.cancel();
    this.synth.speak(utterThis);
    this.synth.resume();
  }

  stopOutput() {
    this.synth.cancel()
  }

  isOutputRunning(): boolean{
    return this.synth.speaking
  }
}

