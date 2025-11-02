// 通过全局命名空间访问共用的倒计时逻辑

// 页面加载时初始化
window.onload = function() {
  // 定时更新显示
  function startDisplay() {
    window.displayTime ? window.displayTime() : console.log('displayTime函数未加载');
    setTimeout(startDisplay, 1000);
  }
  startDisplay();
};