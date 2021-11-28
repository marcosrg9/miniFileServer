import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ElementInterface } from 'src/app/interfaces/list-interface';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-queues',
  templateUrl: './queues.component.html',
  styleUrls: ['./queues.component.css']
})
export class QueuesComponent implements OnInit {

  $files: Subscription;
  downloads: ElementInterface[];

  constructor(public files: FilesService) {
    this.$files = files.$files.subscribe({
      next: (data => {
        const filter = data.filter(file => {
          if (file.status?.downloading) return file
          else return null
        });
        console.log(filter);
        this.downloads = filter
      })
    });
  }

  ngOnInit(): void {
  }

}
