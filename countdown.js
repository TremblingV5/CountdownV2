// 导入共用的倒计时逻辑
import { displayTime } from './common.js';

// 页面加载时初始化
window.onload = function() {
  // 定时更新显示
  function startDisplay() {
    displayTime();
    setTimeout(startDisplay, 1000);
  }
  startDisplay();
};