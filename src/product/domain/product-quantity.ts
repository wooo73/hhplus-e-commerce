import { ApiProperty } from '@nestjs/swagger';
import { ProductQuantity } from '@prisma/client';

export class ProductQuantityEntity implements ProductQuantity {
    @ApiProperty({ example: 1, description: '상품 수량 ID' })
    id: number;

    @ApiProperty({ example: 1, description: '상품 ID' })
    productId: number;

    @ApiProperty({ example: 10, description: '총 재고' })
    quantity: number;

    @ApiProperty({ example: 5, description: '남은 재고' })
    remainingQuantity: number;
}
