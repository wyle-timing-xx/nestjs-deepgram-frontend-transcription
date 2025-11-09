import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FrontendDetectionService {
  private readonly logger = new Logger(FrontendDetectionService.name);

  // 前端相关技术关键词列表
  private readonly frontendKeywords = [
    // 前端框架和库
    'react', 'vue', 'angular', 'svelte', 'solid', 'preact', 'jquery',
    // JavaScript和TypeScript
    'javascript', 'typescript', 'js', 'ts', 'ecmascript', 'es6', 'es2015', 'es2016', 'es2017', 'es2018', 'es2019', 'es2020', 'es2021', 'es2022',
    // HTML相关
    'html', 'html5', 'semantic html', 'markup', 'dom', 'document object model',
    // CSS相关
    'css', 'css3', 'sass', 'scss', 'less', 'stylus', 'postcss', 'tailwind', 'bootstrap', 'material ui', 'ant design', 'chakra ui',
    // 构建和打包工具
    'webpack', 'vite', 'parcel', 'rollup', 'esbuild', 'babel', 'swc', 'turbopack', 'browserify',
    // 状态管理
    'redux', 'vuex', 'pinia', 'mobx', 'recoil', 'zustand', 'jotai', 'xstate',
    // 路由
    'react router', 'vue router', 'angular router', 'next router', 'reach router',
    // 前端测试
    'jest', 'testing library', 'cypress', 'playwright', 'enzyme', 'vitest', 'storybook', 'msw',
    // 前端框架和SSR/SSG解决方案
    'next.js', 'nuxt', 'gatsby', 'remix', 'astro', 'sveltekit', 'vuepress', 'gridsome',
    // 前端工程化和代码质量
    'eslint', 'prettier', 'stylelint', 'husky', 'lint-staged', 'commitlint',
    // 前端性能优化
    'lighthouse', 'web vitals', 'performance', 'lazy loading', 'code splitting',
    // 前端安全
    'csp', 'content security policy', 'xss', 'cross site scripting', 'csrf', 'cross site request forgery',
    // 浏览器API和Web API
    'fetch', 'websocket', 'service worker', 'web worker', 'indexeddb', 'localstorage', 'sessionstorage',
    // 网络相关
    'http', 'https', 'rest', 'graphql', 'api', 'ajax', 'xhr', 'websocket',
    // 移动和响应式开发
    'responsive', 'mobile first', 'pwa', 'progressive web app', 'media query',
    // Web Components
    'web components', 'custom elements', 'shadow dom', 'lit element', 'stencil',
    // 常用前端库和工具
    'lodash', 'axios', 'moment', 'dayjs', 'date-fns', 'i18n', 'internationalization',
    // 前端设计和用户体验
    'ux', 'user experience', 'ui', 'user interface', 'accessibility', 'a11y',
    // 前端中文相关术语
    '前端', '前端开发', '网页', '浏览器', '响应式', '移动端', '桌面端', '跨平台',
    '前端框架', '组件', '状态管理', '路由', '构建工具', '打包',
    // 中文常用框架名称
    '脚手架', '微前端', '小程序', '公众号', '单页应用', '多页应用'
  ];

  // 检测转录文本中的前端相关内容
  detectFrontendContent(transcript: string): { 
    isFrontendRelated: boolean;
    keywords: string[];
    relevanceScore: number;
  } {
    if (!transcript) {
      return { isFrontendRelated: false, keywords: [], relevanceScore: 0 };
    }
    
    const lowerCaseText = transcript.toLowerCase();
    const foundKeywords = this.frontendKeywords.filter(keyword => 
      lowerCaseText.includes(keyword.toLowerCase())
    );
    
    // 计算相关性得分 (0-100)
    const relevanceScore = Math.min(100, Math.round((foundKeywords.length / this.frontendKeywords.length) * 100 * 5));
    
    // 如果找到至少一个关键词，则认为是前端相关
    const isFrontendRelated = foundKeywords.length > 0;
    
    this.logger.log(`Frontend relevance detection: ${relevanceScore}%, keywords: ${foundKeywords.length}`);
    
    return {
      isFrontendRelated,
      keywords: foundKeywords,
      relevanceScore
    };
  }

  // 从转录结果中提取和分析前端相关内容
  analyzeFrontendContent(transcriptionResults: any): {
    isFrontendRelated: boolean;
    frontendTopics: string[];
    relevanceScore: number;
    frontendKeywordsDetected: string[];
    transcript: string;
    summary?: string;
  } {
    // 如果没有结果，返回空结果
    if (!transcriptionResults || !transcriptionResults.channels || transcriptionResults.channels.length === 0) {
      return {
        isFrontendRelated: false,
        frontendTopics: [],
        relevanceScore: 0,
        frontendKeywordsDetected: [],
        transcript: ''
      };
    }
    
    // 获取完整转录文本
    const transcript = transcriptionResults.channels[0].alternatives[0].transcript || '';
    
    // 检测前端相关内容
    const detectionResult = this.detectFrontendContent(transcript);
    
    // 提取摘要（如果有）
    const summary = transcriptionResults.summary?.short || '';
    
    // 提取话题（如果有）
    let topics = [];
    if (transcriptionResults.topics && transcriptionResults.topics.topics) {
      topics = transcriptionResults.topics.topics
        .filter(topic => this.isFrontendTopic(topic.topic));
    }
    
    return {
      isFrontendRelated: detectionResult.isFrontendRelated,
      frontendTopics: topics.map(t => t.topic),
      relevanceScore: detectionResult.relevanceScore,
      frontendKeywordsDetected: detectionResult.keywords,
      transcript,
      summary
    };
  }

  // 判断话题是否与前端相关
  private isFrontendTopic(topic: string): boolean {
    return this.frontendKeywords.some(keyword => 
      topic.toLowerCase().includes(keyword.toLowerCase())
    );
  }
}