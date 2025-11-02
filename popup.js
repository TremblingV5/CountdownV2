// 导入共用的倒计时逻辑
import { displayTime, updateHourtime } from './common.js';

// 页面加载时直接初始化时间选择器
window.addEventListener('DOMContentLoaded', function() {
    initTimeSelectors();
    
    // 定时更新，保存定时器ID以便后续清除
    function startDisplay() {
        displayTime();
        window.timeoutId = setTimeout(startDisplay, 1000);
    }
    startDisplay();
    
    // 添加事件监听器，替代内联onclick
    document.getElementById('saveTimeBtn').addEventListener('click', saveTime);
    
    // 初始化加班开关
    const overtimeSwitch = document.getElementById('overtimeSwitch');
    
    // 从Chrome扩展storage读取开关状态并设置
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['overtimeStatus'], function(result) {
            overtimeSwitch.checked = result.overtimeStatus === true;
        });
        
        // 添加开关状态变化事件监听
        overtimeSwitch.addEventListener('change', function() {
            chrome.storage.local.set({overtimeStatus: this.checked});
        });
    } else {
        // 兼容HTTP服务器环境
        const savedOvertimeStatus = localStorage.getItem('overtimeStatus');
        if (savedOvertimeStatus) {
            overtimeSwitch.checked = savedOvertimeStatus === 'true';
        }
        
        // 添加开关状态变化事件监听
        overtimeSwitch.addEventListener('change', function() {
            localStorage.setItem('overtimeStatus', this.checked.toString());
        });
    }
});

// 初始化时间选择器的下拉选项
function initTimeSelectors() {
    var hourSelector = document.getElementById("hourSelector");
    var minuteSelector = document.getElementById("minuteSelector");
    
    // 清空现有选项
    hourSelector.innerHTML = '';
    minuteSelector.innerHTML = '';
    
    // 生成小时选项 (0-23)
    for (var i = 0; i < 24; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.text = i < 10 ? '0' + i : i;
        hourSelector.appendChild(option);
    }
    
    // 生成分钟选项 (只包含0, 15, 30, 45)
    var minutes = [0, 15, 30, 45];
    for (var i = 0; i < minutes.length; i++) {
        var option = document.createElement('option');
        option.value = minutes[i];
        option.text = minutes[i] < 10 ? '0' + minutes[i] : minutes[i];
        minuteSelector.appendChild(option);
    }
    
    // 获取当前设置的时间并设置默认选中值
    function setTimeSelectors(timeString) {
        var timeParts = timeString.split(':');
        
        if (timeParts.length === 3) {
            hourSelector.value = parseInt(timeParts[0]);
            
            // 对于分钟，如果当前值不在预设选项中，则选择最近的预设值
            var currentMinute = parseInt(timeParts[1]);
            if (minutes.indexOf(currentMinute) === -1) {
                // 找到最近的预设分钟值
                var closestMinute = minutes.reduce(function(prev, curr) {
                    return (Math.abs(curr - currentMinute) < Math.abs(prev - currentMinute)) ? curr : prev;
                });
                minuteSelector.value = closestMinute;
            } else {
                minuteSelector.value = currentMinute;
            }
        }
    }
    
    // 根据环境获取时间设置
    if (typeof chrome !== 'undefined' && chrome.storage) {
        // Chrome扩展环境
        chrome.storage.local.get(['hourtime'], function(result) {
            var curr = result.hourtime || "18:00:00";
            setTimeSelectors(curr);
        });
    } else {
        // HTTP服务器环境
        var curr = localStorage.getItem("hourtime") || "18:00:00";
        setTimeSelectors(curr);
    }
}

// 保存选择的时间
function saveTime() {
    var hourSelector = document.getElementById("hourSelector");
    var minuteSelector = document.getElementById("minuteSelector");
    
    // 获取选择的值
    var hour = parseInt(hourSelector.value);
    var minute = parseInt(minuteSelector.value);
    
    // 格式化时间字符串，秒固定为00
    var formattedHour = hour < 10 ? '0' + hour : hour;
    var formattedMinute = minute < 10 ? '0' + minute : minute;
    var formattedSecond = '00';
    
    var timeString = formattedHour + ':' + formattedMinute + ':' + formattedSecond;
    
    // 保存时间设置
    if (typeof chrome !== 'undefined' && chrome.storage) {
        // Chrome扩展环境
        chrome.storage.local.set({"hourtime": timeString}, function() {
            // 更新共用模块中的时间变量
            updateHourtime(timeString);
            
            // 清除可能存在的旧定时器，避免多个定时器同时运行
            if (window.timeoutId) {
                clearTimeout(window.timeoutId);
            }
            
            // 立即刷新显示
            displayTime();
            
            // 显示成功提示
            showSuccessMessage('保存成功');
        });
    } else {
        // HTTP服务器环境
        localStorage.setItem("hourtime", timeString);
        // 更新共用模块中的时间变量
        updateHourtime(timeString);
        
        // 清除可能存在的旧定时器，避免多个定时器同时运行
        if (window.timeoutId) {
            clearTimeout(window.timeoutId);
        }
        
        // 立即刷新显示
        displayTime();
        
        // 显示成功提示
        showSuccessMessage('保存成功');
    }
}

// 显示成功提示消息
function showSuccessMessage(message) {
    var successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    
    // 重置透明度并设置过渡
    successMessage.style.opacity = '0';
    successMessage.style.transition = 'opacity 0.3s ease';
    
    // 强制重排后设置opacity为1以触发过渡动画
    setTimeout(() => {
        successMessage.style.opacity = '1';
    }, 10);
    
    // 3秒后隐藏提示
    setTimeout(() => {
        successMessage.style.opacity = '0';
    }, 3000);
}