import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'convertDate' })
export class ConvertDatePipe implements PipeTransform {
  transform(value: string): Date | null {
    if (!value) return null;

    const [date, time] = value.split(' ');
    const [day, month, year] = date.split('-');

    return new Date(`${year}-${month}-${day}T${time}`);
  }
}
