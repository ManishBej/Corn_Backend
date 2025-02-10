import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('App E2E Tests', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    connection = moduleFixture.get<Connection>(getConnectionToken());
    await app.init();
  });

  afterEach(async () => {
    await connection.dropDatabase();
    await connection.close();
    await app.close();
  });

  describe('AppController', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('WebhookController', () => {
    it('/webhooks (POST) - should create a webhook record', async () => {
      const webhookData = {
        message: 'Test webhook data',
        timestamp: new Date().toISOString()
      };

      const response = await request(app.getHttpServer())
        .post('/webhooks')
        .send(webhookData)
        .expect(201);

      expect(response.body.data).toEqual(webhookData);
      expect(response.body.createdAt).toBeDefined();
    });

    it('/webhooks (GET) - should retrieve webhook records', async () => {
      // Create test webhook first
      const webhookData = { message: 'Test data' };
      await request(app.getHttpServer())
        .post('/webhooks')
        .send(webhookData)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/webhooks')
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].data).toEqual(webhookData);
    });
  });
});
