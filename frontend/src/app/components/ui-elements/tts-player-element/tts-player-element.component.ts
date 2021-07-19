import { Component, Input, OnInit } from '@angular/core';
import { UserContext } from 'src/app/model/user-context';
import { SpeechService } from 'src/app/services/speech.service';
import { UserContextService } from 'src/app/services/user-context.service';

/**
 * TTS player element
 * 
 * This component displays the controls for the tts feature of the 
 * web app. This feature is activated if the user prefers the self-voicing-
 * feature. This component uses the speech service to start the tts function. 
 */
@Component({
  selector: 'app-tts-player-element',
  templateUrl: './tts-player-element.component.html',
  styleUrls: ['./tts-player-element.component.scss']
})
export class TtsPlayerElementComponent implements OnInit {
  play: boolean = false;
  userContext?: UserContext
  /**
   * Very important function which is passed by the parent 
   * component. The parent components have to define the function
   * so that the text is generated when the user presses play. 
   */
  @Input() ttsTextGeneratorFunction: () => string = () => "";

  constructor(private userContextService: UserContextService,
              private speechService: SpeechService) { }

  ngOnInit(): void {
    this.userContextService.getUserContextSubject().subscribe(data => {
      this.userContext = data;
    })
  }

  /**
   * Stops the tts feature
   */
  onPause() {
    this.play = false;
    this.speechService.stopOutput();
  }

  /**
   * Starts the tts feature.
   */
  onPlay() {
    this.play = true;
    let text = this.ttsTextGeneratorFunction();
    this.speechService.startOutput(text);
    this.listenForStop(this.speechService);
  }

  /**
   * Listens for the stop of the speech output.
   */
  listenForStop(speechService: SpeechService) {
    let service = speechService
    if(service.isOutputRunning()) {
      setTimeout(() => this.listenForStop(service), 1000);
    } else {
      this.play = false;
    }
  }
}
