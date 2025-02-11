import { Module } from '@nestjs/common';
import { AlimTalkService } from './alim-talk.service';

@Module({
    providers: [AlimTalkService],
    exports: [AlimTalkService],
})
export class AlimTalkModule {}
