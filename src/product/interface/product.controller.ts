import { Controller } from '@nestjs/common';
import { ProductService } from '../application/product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}
}
