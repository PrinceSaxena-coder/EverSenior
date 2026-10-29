import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppState, AppStateSchema } from './app-state.schema';
import { AppStateController } from './app-state.controller';
import { AppStateService } from './app-state.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: AppState.name, schema: AppStateSchema }])],
  controllers: [AppStateController],
  providers: [AppStateService],
  exports: [AppStateService],
})
export class AppStateModule {}
