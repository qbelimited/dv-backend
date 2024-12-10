import { Test, TestingModule } from '@nestjs/testing';
import { DvPlatesController } from './dv-plates.controller';

describe('DvPlatesController', () => {
  let controller: DvPlatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DvPlatesController],
    }).compile();

    controller = module.get<DvPlatesController>(DvPlatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
