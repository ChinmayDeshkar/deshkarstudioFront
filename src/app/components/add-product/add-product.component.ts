import { Component, OnInit } from '@angular/core';
import { log } from 'console';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  product = {
    productId: null,
    productName: '',
    price: 0,
  };

  products: any[] = [];
  message = '';
  editingIndex: number | null = null;

  editMode: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe((res) => {
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
    this.editMode = true;
  }

  deleteProduct(index: number) {
    var confirmation = confirm('Are you sure you want to delete this product?');
    if (confirmation) {
      const id = this.products[index].productId;
      this.productService.deleteProduct(id).subscribe(() => {
        this.message = 'Product deleted';
        this.loadProducts();
      });
    }
  }

  resetForm() {
    this.product = {
      productId: null,
      productName: '',
      price: 0,
    };
  }

  updateProduct() {
    // This method is now handled in submitProduct

    console.log('Product updated:' + this.product.productId);
    console.log('editingIndex:' + this.editingIndex);

    this.productService.updateProduct(this.product).subscribe((res) => {
      console.log(this.product);
      console.log(res);
      this.message = 'Product updated successfully';
      this.editingIndex = null;
      this.editMode = false;
      this.resetForm();
      this.loadProducts();
      window.location.reload();
    });
  }
}
