import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class TranscriptionResponseDto {
  @ApiProperty({ description: '文件名' })
  fileName: string;

  @ApiProperty({ description: '文件大小（字节）' })
  fileSize: number;

  @ApiProperty({ description: '文件MIME类型' })
  mimeType: string;

  @ApiProperty({ description: '转录文本' })
  transcript: string;

  @ApiProperty({ description: '是否与前端相关' })
  isFrontendRelated: boolean;

  @ApiProperty({ description: '前端相关性得分（0-100）' })
  relevanceScore: number;

  @ApiProperty({ description: '检测到的前端关键词' })
  frontendKeywordsDetected: string[];

  @ApiProperty({ description: '前端相关的主题' })
  frontendTopics: string[];

  @ApiProperty({ description: '转录摘要（如果有）' })
  summary?: string;

  @ApiProperty({ description: '处理时间戳' })
  timestamp: string;
}

export class TranscriptionOptionsDto {
  @ApiProperty({ description: '是否强制检测前端相关内容，即使相关性较低', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  forceDetection?: boolean;
}