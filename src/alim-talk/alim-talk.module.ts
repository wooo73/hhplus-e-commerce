import { Module } from '@nestjs/common';
import { AlimTalkService } from './alim-talk.service';
import { AlimTalkHandler } from './events/alim-talk.event.handler';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
    imports: [LoggerModule],
    providers: [AlimTalkService, AlimTalkHandler],
    exports: [AlimTalkService, AlimTalkHandler],
})
export class AlimTalkModule {}
