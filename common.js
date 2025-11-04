// 共用的倒计时核心逻辑
// 通过全局命名空间访问timeUtils中的函数

var hourtime = "18:00:00"; // 默认值

// 初始化时间设置
function initHourtime() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        // Chrome扩展环境
        chrome.storage.local.get(['hourtime'], function(result) {
            if (result.hourtime) {
                hourtime = result.hourtime;
            }
        });
    } else {
        // HTTP服务器环境
        var saved = localStorage.getItem("hourtime");
        if (saved != null) {
            hourtime = saved;
        }
    }
}

// 立即初始化
initHourtime();

// 核心显示时间函数
function displayTime() {
    var elt = document.getElementById("clock");
    var elt2 = document.getElementById("todaydatetime");
    
    // 每次调用都从localStorage获取最新的时间设置
    var currentHourtime = hourtime; // 使用全局变量作为默认值
    
    // 优先从localStorage获取最新设置
    if (typeof chrome !== 'undefined' && chrome.storage) {
        // Chrome扩展环境 - 同步获取（可能会有延迟，但比异步好）
        chrome.storage.local.get(['hourtime'], function(result) {
            if (result.hourtime) {
                currentHourtime = result.hourtime;
            }
        });
    } else {
        // HTTP服务器环境
        var saved = localStorage.getItem("hourtime");
        if (saved != null) {
            currentHourtime = saved;
        }
    }
    
    // 使用统一的方法检查上班时间和获取文案
    const workingTimeInfo = window.checkWorkingTime ? window.checkWorkingTime(currentHourtime) : { message: '函数未加载', leftSeconds: 0 };
    
    // 显示当前日期和时间
    elt2.innerHTML = window.getCurrentDateTime ? window.getCurrentDateTime() : '时间函数未加载';
    
    // 显示倒计时或提示文案
    elt.innerHTML = workingTimeInfo.message;
    
    return workingTimeInfo.leftSeconds; // 返回剩余秒数供外部使用
}

// 更新hourtime变量（从popup.js调用）
function updateHourtime(newTime) {
    hourtime = newTime;
}

// 获取当前hourtime（供countdown.js使用）
function getCurrentHourtime() {
    return hourtime;
}

// 将函数暴露到全局命名空间，供其他脚本使用
if (typeof window !== 'undefined') {
    window.displayTime = displayTime;
    window.updateHourtime = updateHourtime;
    window.getCurrentHourtime = getCurrentHourtime;
}