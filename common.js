// 共用的倒计时核心逻辑
import { checkWorkingTime, getCurrentDateTime } from './timeUtils.js';

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
export function displayTime() {
    var elt = document.getElementById("clock");
    var elt2 = document.getElementById("todaydatetime");
    
    // 使用统一的方法检查上班时间和获取文案
    const workingTimeInfo = checkWorkingTime(hourtime);
    
    // 显示当前日期和时间
    elt2.innerHTML = getCurrentDateTime();
    
    // 显示倒计时或提示文案
    elt.innerHTML = workingTimeInfo.message;
    
    return workingTimeInfo.leftSeconds; // 返回剩余秒数供外部使用
}

// 更新hourtime变量（从popup.js调用）
export function updateHourtime(newTime) {
    hourtime = newTime;
}

// 获取当前hourtime（供countdown.js使用）
export function getCurrentHourtime() {
    return hourtime;
}