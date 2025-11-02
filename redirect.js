// 重定向函数 - 兼容HTTP服务器和Chrome扩展环境
import { checkRedirectCondition } from './timeUtils.js';

function checkRedirect() {
  console.log('Redirect.js: 脚本开始执行 - 检查重定向条件');
  
  const currentUrl = window.location.href;
  console.log('Redirect.js: 当前URL =', currentUrl);
  
  // 检查是否已经是倒计时页面，避免循环重定向
  if (currentUrl.includes('countdown.html') || currentUrl.includes('popup.html')) {
    console.log('Redirect.js: 已在倒计时页面或设置页面，跳过重定向');
    return;
  }
  
  // 检查加班开关状态 - 优先使用Chrome扩展的storage API
  if (typeof chrome !== 'undefined' && chrome.storage) {
    // Chrome扩展环境
    chrome.storage.local.get(['overtimeStatus'], function(result) {
      const overtimeStatus = result.overtimeStatus;
      console.log('Redirect.js: Chrome扩展环境 overtimeStatus =', overtimeStatus);
      
      // 使用统一的方法检查重定向条件
      const redirectInfo = checkRedirectCondition(overtimeStatus);
      console.log('Redirect.js: 重定向检查结果 =', redirectInfo);
      
      // 当需要重定向时执行重定向
      if (redirectInfo.shouldRedirect) {
        console.log('Redirect.js: 条件满足，执行重定向');
        
        // 在Chrome扩展环境中，需要重定向到扩展内部的页面
        const extensionUrl = chrome.runtime.getURL('countdown.html');
        console.log('Redirect.js: 执行重定向到', extensionUrl);
        window.location.href = extensionUrl;
      } else {
        console.log('Redirect.js: 加班模式开启或上班时间，不执行重定向');
      }
    });
  } else {
    // HTTP服务器环境
    const overtimeStatus = localStorage.getItem('overtimeStatus');
    console.log('Redirect.js: HTTP服务器环境 overtimeStatus =', overtimeStatus);
    
    // 使用统一的方法检查重定向条件
    const redirectInfo = checkRedirectCondition(overtimeStatus === 'true');
    console.log('Redirect.js: 重定向检查结果 =', redirectInfo);
    
    // 当需要重定向时执行重定向
    if (redirectInfo.shouldRedirect) {
      console.log('Redirect.js: 条件满足，执行重定向');
      
      // 使用最简单的重定向方式
      console.log('Redirect.js: 执行重定向到countdown.html');
      window.location.href = 'countdown.html';
    } else {
      console.log('Redirect.js: 加班模式开启或上班时间，不执行重定向');
    }
  }
}

// 立即执行重定向检查
console.log('Redirect.js: 脚本已加载，开始执行重定向检查');
checkRedirect();