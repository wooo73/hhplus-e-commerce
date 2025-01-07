import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class GetProductsQueryDTO {
    @ApiProperty({ example: 1, description: '페이지 번호' })
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    page: number = 1;

    @ApiProperty({ example: 10, description: '페이지 크기' })
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(10)
    size: number = 10;

    get offset() {
        return (this.page - 1) * this.size;
    }
}
