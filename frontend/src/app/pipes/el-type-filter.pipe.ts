import { Pipe, PipeTransform } from '@angular/core';
import { ElementInterface } from '../interfaces/list-interface';

@Pipe({
  name: 'elTypeFilter'
})
export class ElTypeFilterPipe implements PipeTransform {

  transform(element: ElementInterface[], type: string) {
    return element.filter(el => el.type === type)

  }

}
