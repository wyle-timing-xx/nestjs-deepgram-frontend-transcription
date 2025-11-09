
# NestJS Deepgram Frontend Transcription Service

基于 NestJS 和 Deepgram API 构建的语音转文字服务，专注于识别前端相关内容。

## 功能特点

- 使用 Deepgram 转录音频文件
- 专门检测和分析与前端开发相关的内容
- 关键词识别和相关性评分
- 支持多种音频格式
- RESTful API 设计
- Swagger API 文档
- 基于 TypeScript 和 NestJS 构建

## 前置条件

- Node.js 16+
- Deepgram API 密钥

## 安装

```bash
# 安装依赖
npm install
```

## 配置

在项目根目录创建 `.env` 文件，参照 `.env.example` 配置:

```env
# Deepgram API Key
DEEPGRAM_API_KEY=your_deepgram_api_key_here

# 应用端口
PORT=3000

# 最大上传文件大小 (MB)
MAX_FILE_SIZE=10
```

## 启动应用

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

## API 使用

服务启动后，可以通过以下方式访问 API 文档：

```
http://localhost:3000/api
```

### 转录 API

```
POST /transcription/audio
```

请求格式: `multipart/form-data`

参数:
- `file`: 音频文件 (支持 mp3, wav, ogg, m4a, webm 等)
- `options.forceDetection`: (可选) 布尔值，是否强制检测前端相关内容

响应格式:
```json
{
  "fileName": "示例.mp3",
  "fileSize": 1024000,
  "mimeType": "audio/mpeg",
  "transcript": "完整的转录文本...",
  "isFrontendRelated": true,
  "relevanceScore": 85,
  "frontendKeywordsDetected": ["react", "typescript", "webpack"],
  "frontendTopics": ["前端框架", "构建工具"],
  "summary": "讨论了React组件开发和Webpack配置的最佳实践",
  "timestamp": "2025-11-09T09:30:45Z"
}
```

## 前端技术关键词

服务内置了大量前端相关技术关键词，包括但不限于：

- 前端框架: React, Vue, Angular, Svelte等
- JavaScript/TypeScript
- HTML/CSS及相关技术
- 构建工具: Webpack, Vite, Rollup等
- 状态管理库
- 前端路由
- 测试框架
- SSR/SSG解决方案
- 前端工程化工具
- 性能优化相关
- 前端安全
- Web API和浏览器API
- 网络相关技术
- 响应式开发和移动开发
- Web Components
- 常用前端库和工具
- 前端设计和用户体验
- 中文前端术语

## 许可证

MIT
