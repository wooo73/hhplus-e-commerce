import { IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { Product } from '../../domain/product';
import { ProductQuantity } from '../../domain/product-quantity';

export class ProductResponseDto extends IntersectionType(
    OmitType(Product, ['createdAt', 'updatedAt'] as const),
    PickType(ProductQuantity, ['quantity', 'remainingQuantity'] as const),
) {}
