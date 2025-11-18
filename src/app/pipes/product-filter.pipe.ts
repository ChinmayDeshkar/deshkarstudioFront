import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {
  transform(products: any[], search: string): any[] {
    if (!search) return products;
    search = search.toLowerCase();

    return products.filter(p =>
      p.productName.toLowerCase().includes(search)
    );
  }
}
