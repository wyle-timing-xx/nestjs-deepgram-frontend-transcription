import { Test, TestingModule } from '@nestjs/testing';
import { TranscriptionService } from './transcription.service';
import { DeepgramService } from './deepgram.service';
import { FrontendDetectionService } from './frontend-detection.service';
import { ConfigService } from '@nestjs/config';

// Mock外部服务
jest.mock('./deepgram.service');
jest.mock('./frontend-detection.service');

describe('TranscriptionService', () => {
  let service: TranscriptionService;
  let deepgramService: DeepgramService;
  let frontendDetectionService: FrontendDetectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranscriptionService,
        DeepgramService,
        FrontendDetectionService,
        ConfigService,
      ],
    }).compile();

    service = module.get<TranscriptionService>(TranscriptionService);
    deepgramService = module.get<DeepgramService>(DeepgramService);
    frontendDetectionService = module.get<FrontendDetectionService>(FrontendDetectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transcribeAndAnalyzeFile', () => {
    it('should process file and return analysis', async () => {
      const mockFile = {
        originalname: 'test.mp3',
        buffer: Buffer.from('test'),
        size: 100,
        mimetype: 'audio/mpeg',
      } as Express.Multer.File;
      
      const mockTranscriptionResults = {
        channels: [
          {
            alternatives: [
              {
                transcript: 'This is a test about React and TypeScript',
              },
            ],
          },
        ],
      };
      
      const mockAnalysis = {
        isFrontendRelated: true,
        frontendTopics: ['React', 'TypeScript'],
        relevanceScore: 80,
        frontendKeywordsDetected: ['react', 'typescript'],
        transcript: 'This is a test about React and TypeScript',
      };
      
      jest.spyOn(deepgramService, 'transcribeBuffer').mockResolvedValue(mockTranscriptionResults);
      jest.spyOn(frontendDetectionService, 'analyzeFrontendContent').mockReturnValue(mockAnalysis);
      
      const result = await service.transcribeAndAnalyzeFile(mockFile);
      
      expect(result.fileName).toBe('test.mp3');
      expect(result.fileSize).toBe(100);
      expect(result.mimeType).toBe('audio/mpeg');
      expect(result.isFrontendRelated).toBe(true);
      expect(deepgramService.transcribeBuffer).toHaveBeenCalledWith(mockFile.buffer, mockFile.mimetype);
      expect(frontendDetectionService.analyzeFrontendContent).toHaveBeenCalledWith(mockTranscriptionResults);
    });
  });
});