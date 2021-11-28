import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs'

import { ElementInterface } from 'src/app/interfaces/list-interface';
import { AuthService } from 'src/app/services/auth.service';
import { FilesService } from 'src/app/services/files.service';
import { SocketsService } from 'src/app/services/sockets.service';

import { ListInterface } from '../../../interfaces/list-interface'

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css']
})

export class ExplorerComponent implements OnDestroy {

  private $files: Subscription

  public elements: ElementInterface[];
  public path:     string

  constructor(public files: FilesService,
              private socket: SocketsService,
              private auth: AuthService,
              private zone: NgZone) {
    
    this.explore();
    this.$files = files.$files.subscribe(files => {
      console.log('Cambiando!')
      this.elements = [];
      this.elements = files;
      console.log(files);
      
    })
  }

  download(file: ElementInterface) {
    const { pathData } = file;
    const { dir, base } = pathData;
    this.files.download(file);
    console.log(this.files.files)
  }

  explore() {
    this.files.list(this.auth.user.lastPath)
  }

  ngOnDestroy(): void {
    this.$files.unsubscribe();
  }

}
