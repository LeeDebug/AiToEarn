import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';
import { MetaModule } from '@/core/plat/meta/meta.module';
import { TwitterModule } from '@/core/plat/twitter/twitter.module';
import { MetaContainer, MetaContainerSchema } from '@/libs/database/schema/metaContainer.schema';
import { PublishRecord, PublishRecordSchema } from '@/libs/database/schema/publishRecord.schema';
import { PublishTask, PublishTaskSchema } from '@/libs/database/schema/publishTask.schema';
import { MetaContainerService } from './container.service';
import { FacebookPublishService } from './facebook.service';
import { InstagramPublishService } from './instgram.service';
import { MetaPublishService } from './meta.service';
import { ThreadsPublishService } from './threads.service';
import { TwitterPublishService } from './twitter.service';

@Module({
  controllers: [],
  providers: [
    MetaPublishService,
    FacebookPublishService,
    InstagramPublishService,
    ThreadsPublishService,
    MetaContainerService,
    TwitterPublishService,
  ],
  exports: [
    MetaPublishService,
    FacebookPublishService,
    InstagramPublishService,
    ThreadsPublishService,
    MetaContainerService,
    TwitterPublishService,
  ],
  imports: [
    MetaModule,
    TwitterModule,
    BullModule.registerQueue({
      name: 'bull_publish',
    }),
    BullModule.registerQueue({
      name: 'meta_media_task',
      prefix: 'meta:',
      defaultJobOptions: {
        attempts: 0,
        delay: 20000, // 20 seconds
        removeOnComplete: true,
      },
    }),
    MongooseModule.forFeature([
      { name: PublishRecord.name, schema: PublishRecordSchema },
      { name: PublishTask.name, schema: PublishTaskSchema },
      { name: MetaContainer.name, schema: MetaContainerSchema },
    ]),
  ],
})
export class MetaPublishModule { }
