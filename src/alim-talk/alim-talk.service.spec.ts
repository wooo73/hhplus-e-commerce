import { Test, TestingModule } from '@nestjs/testing';
import { AlimTalkModule } from './alim-talk.module';
import { AlimTalkService } from './alim-talk.service';
import { AlimTalkResponse } from '../common/status';

describe('AlimTalkService', () => {
    let service: AlimTalkService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AlimTalkModule],
        }).compile();

        service = module.get<AlimTalkService>(AlimTalkService);
    });

    it('should be defined', async () => {
        const message = {
            userId: 1,
            subject: '결제 완료',
            orderId: 1,
            orderItem: [
                {
                    productId: 1,
                    productName: '테스트 상품',
                    productPrice: 30_000,
                    productQuantity: 1,
                },
            ],
            couponId: 0,
            totalAmount: 30_000,
            discountAmount: 0,
            finalAmount: 30_000,
            createdAt: '2025-02-11 14:30',
        };

        const sendMessage = await service.sendMessage(message);
        expect(sendMessage).toEqual(AlimTalkResponse.SEND_SUCCESS);
    });
});
