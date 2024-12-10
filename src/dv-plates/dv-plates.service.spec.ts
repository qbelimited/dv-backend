import { Test, TestingModule } from '@nestjs/testing';
import { DVSerialService } from './dv-plates.service';

describe('DVSerialService', () => {
  let service: DVSerialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DVSerialService],
    }).compile();

    service = module.get<DVSerialService>(DVSerialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
