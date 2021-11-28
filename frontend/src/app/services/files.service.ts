import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, catchError, Observable, Subject } from 'rxjs';

import { ElementInterface, ListInterface } from '../interfaces/list-interface';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  files: ListInterface;
  $files: Subject<ElementInterface[]> = new Subject();

  constructor(private http: HttpClient,
              private zone: NgZone) {
    this.$files.next([])
  }

  public upload(file: File): Observable<any> {

    const data = new FormData();
    data.append("file", file);

    return this.http.post('/upload', data, { reportProgress: true, observe: 'events' })
    /* .pipe(
      catchError(this.errorMgmt)
      ) */
  }

  public download(file: ElementInterface) {

    file.status = {
      downloading: true,
      total: 23719831829,
      progress: 23103102
    }

    this.$files.next(this.files.elements)


    /* const { dir, base } = file.pathData;
    console.log(file)
    let a = document.createElement('a');
    a.download = base;
    a.style.display = 'none';
    this.http.post('/api/download', { path: `${dir}/${base}` }, { responseType: 'blob'})
    .subscribe({
      next: (data => {
        const stream = createWriteStream(base,{
          pathname: '/api/download',
          size: file.data.size
        });
      }),
    }) */
  }

  public list(directory: string):Observable<ListInterface> {
    console.log(directory)
    const subs = this.http.post<ListInterface>('/api/list', { path: directory })
    subs.subscribe(data => {
      this.$files.next(data.elements)
      console.log(this.files)
    });
    return subs;
  }

  private errorMgmt(error: HttpErrorResponse, caught: Observable<any>) {

  }
}
