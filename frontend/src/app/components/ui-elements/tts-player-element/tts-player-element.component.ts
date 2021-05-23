import { Component, Input, OnInit } from '@angular/core';
import { UserContext } from 'src/app/model/user-context';
import { UserContextService } from 'src/app/services/user-context.service';

@Component({
  selector: 'app-tts-player-element',
  templateUrl: './tts-player-element.component.html',
  styleUrls: ['./tts-player-element.component.scss']
})
export class TtsPlayerElementComponent implements OnInit {
  play: boolean = false;
  selfVoicingEnabled : boolean = false;
  userContext?: UserContext
  @Input() ttsString = "Test";

  constructor(private userContextService: UserContextService) { }

  ngOnInit(): void {
    this.userContextService.getUserContext().subscribe(data => {
      this.selfVoicingEnabled = data.selfVoicingEnabled;
      this.userContext = data;
    })
  }

  onPause() {
    this.play = false;
  }

  onPlay() {
    this.play = true;
  }

}
