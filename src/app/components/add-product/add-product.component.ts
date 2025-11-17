import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  product = {
    productId: null,
    productName: '',
    price: 0
  };

  products: any[] = [];
  message = '';
  editingIndex: number | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(res => {
      this.products = res;
    });
  }

  submitProduct() {
    if (!this.product.productName || !this.product.price) {
      this.message = 'Product Name and Price are required';
      return;
    }

    if (this.editingIndex !== null) {
      // Editing existing product
      const updated = { ...this.product };
      this.productService.updateProduct(updated).subscribe(() => {
        this.message = 'Product updated successfully';
        this.editingIndex = null;
        this.resetForm();
        this.loadProducts();
      });
    } else {
      // Adding new product
      this.productService.addProduct(this.product).subscribe(() => {
        this.message = 'Product added successfully';
        this.resetForm();
        this.loadProducts();
      });
    }
  }

  editProduct(index: number) {
    this.editingIndex = index;
    this.product = { ...this.products[index] };
  }

  deleteProduct(index: number) {
    const id = this.products[index].productId;
    this.productService.deleteProduct(id).subscribe(() => {
      this.message = 'Product deleted';
      this.loadProducts();
    });
  }

  resetForm() {
    this.product = {
      productId: null,
      productName: '',
      price: 0
    };
  }
}
