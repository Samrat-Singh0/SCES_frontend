import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenerateDownloadLinkService {

  constructor(
  ) { }

  generateLink(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
