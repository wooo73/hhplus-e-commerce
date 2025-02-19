import { Module } from '@nestjs/common';
import { LoggerModule } from '../common/logger/logger.module';

import { AlimTalkService } from './alim-talk.service';

@Module({
    imports: [LoggerModule],
    providers: [AlimTalkService],
    exports: [AlimTalkService],
})
export class AlimTalkModule {}
