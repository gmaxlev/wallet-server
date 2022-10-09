import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    type: 'postgres',
                    synchronize: true,
                    dropSchema: true,
                    host: config.getOrThrow('DB_HOST'),
                    port: config.getOrThrow('DB_PORT'),
                    username: config.getOrThrow('DB_USERNAME'),
                    password: config.getOrThrow('DB_PASSWORD'),
                    database: config.getOrThrow('DB_DATABASE'),
                    entities: [],
                };
            },
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}

