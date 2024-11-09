import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoDinero',
  standalone: true
})
export class FormatoDineroPipe implements PipeTransform {

  transform(value: number): string {
    return new Intl.NumberFormat('es-CL').format(value);
  }

}
