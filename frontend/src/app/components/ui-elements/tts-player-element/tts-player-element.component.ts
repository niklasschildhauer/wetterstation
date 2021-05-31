import { Component, Input, OnInit } from '@angular/core';
import { UserContext } from 'src/app/model/user-context';
import { SpeechAPIService } from 'src/app/services/speech-api.service';
import { UserContextService } from 'src/app/services/user-context.service';

@Component({
  selector: 'app-tts-player-element',
  templateUrl: './tts-player-element.component.html',
  styleUrls: ['./tts-player-element.component.scss']
})
export class TtsPlayerElementComponent implements OnInit {
  play: boolean = false;
  userContext?: UserContext
  @Input() ttsTextGeneratorFunction: () => string = () => "";

  constructor(private userContextService: UserContextService,
    private speechService: SpeechAPIService) { }

  ngOnInit(): void {
    this.userContextService.getUserContext().subscribe(data => {
      this.userContext = data;
    })
  }

  onPause() {
    this.play = false;
    this.speechService.stopOutput();
  }

  onPlay() {
    this.play = true;
    let text = this.ttsTextGeneratorFunction();
    this.speechService.startOutput(text);
    this.listenForStop(this.speechService);
  }

  // little bit hacky
  listenForStop(speechService: SpeechAPIService) {
    let service = speechService
    if(service.isOutputRunning()) {
      setTimeout(() => this.listenForStop(service), 1000);
    } else {
      this.play = false;
    }
  }
}
