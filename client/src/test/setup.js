import '@testing-library/jest-dom'

// Mock Web Worker
class MockWorker {
  constructor() {
    this.onmessage = null;
  }
  
  postMessage(msg) {
    // 模拟worker行为
  }
  
  terminate() {
    // 清理
  }
}

global.Worker = MockWorker;

// Mock Audio
global.Audio = class {
  constructor() {
    this.play = vi.fn();
  }
};

// Mock alert
global.alert = vi.fn();