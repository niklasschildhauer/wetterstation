import { Injectable } from '@angular/core';

/**
 * Speech service injectable
 * 
 * Use this service to read aloud a text from the browser speech synthesiser
 */
@Injectable({
  providedIn: 'root'
})

export class SpeechService {
  private synth = window.speechSynthesis;

  constructor() {}

  /**
  * Start the speech output.
  * 
  * @param {UserContstringext} text  The text which should be read aloud
  */
  public startOutput(text: string): void {
    let utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = 'de-DE'
    utterThis.pitch = 1;
    utterThis.rate = 1;

    this.synth.cancel();
    this.synth.speak(utterThis);
    this.synth.resume();
  }

  /**
  * Stop the speech output.
  */
   public stopOutput(): void {
    this.synth.cancel();
  }

  /**
  * @returns True if the speech output is stll running
  */
  public isOutputRunning(): boolean{
    return this.synth.speaking;
  }
}

