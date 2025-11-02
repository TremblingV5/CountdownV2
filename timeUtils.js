// 统一的时间工具函数

// 节假日定义
const holidays = {
    "除夕": get_day("2024/02/09"),
    "过年": [get_time("2024/02/10 00:00:00"), get_time("2024/02/17 23:59:59")],
    "清明节": [get_time("2024/04/04 00:00:00"), get_time("2024/04/06 23:59:59")],
    "劳动节": [get_time("2024/05/01 00:00:00"), get_time("2024/05/05 23:59:59")],
    "端午节": [get_time("2024/06/08 00:00:00"), get_time("2024/06/10 23:59:59")],
    "中秋节": [get_time("2024/09/14 00:00:00"), get_time("2024/09/17 23:59:59")],
    "国庆节": [get_time("2024/10/01 00:00:00"), get_time("2024/10/07 23:59:59")],
};

// 星期数组
const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

// 辅助函数
function get_time(a) {
    return new Date(a).getTime() / 1000;
}

function get_day(a) {
    return [new Date(a + " 00:00:00").getTime() / 1000, new Date(a + " 23:59:59").getTime() / 1000];
}

// 检查当前是否是上班时间
// 返回对象包含：isWorkingTime(是否上班时间), message(文案), holiday(节假日名称), isWeekend(是否周末)
export function checkWorkingTime(hourtime = "18:00:00") {
    const now = new Date();
    const day = now.getDay(); // 0=周日, 1=周一, ..., 6=周六
    const nowTimestamp = new Date().getTime() / 1000;
    
    // 检查是否在节假日范围内
    let holiday = null;
    for(let key in holidays) {
        if (nowTimestamp > holidays[key][0] && nowTimestamp < holidays[key][1]) {
            holiday = key;
            break;
        }
    }
    
    // 检查是否是周末（周六或周日）
    const isWeekend = day === 6 || day === 0;
    
    // 计算距离下班时间
    const endTime = new Date(new Date().toLocaleDateString() + " " + hourtime);
    const leftTime = endTime.getTime() - now.getTime();
    const leftSeconds = parseInt(leftTime / 1000);
    
    // 判断是否上班时间
    let isWorkingTime = true;
    let message = "";
    
    if (holiday !== null) {
        isWorkingTime = false;
        message = `不是吧？${holiday}还上班？`;
    } else if (isWeekend) {
        isWorkingTime = false;
        message = `不是吧？${weeks[day]}还上班？`;
    } else if (leftSeconds < 0) {
        isWorkingTime = false;
        message = "你已经下班了，为什么还不回家？";
    } else {
        const o = Math.floor(leftSeconds / 3600);
        const m = Math.floor(leftSeconds / 60 % 60);
        const s = leftSeconds % 60;
        message = `${o}小时:${m < 10 ? '0' + m : m}分:${s < 10 ? '0' + s : s}秒`;
    }
    
    return {
        isWorkingTime: isWorkingTime,
        message: message,
        holiday: holiday,
        isWeekend: isWeekend,
        leftSeconds: leftSeconds
    };
}

// 检查是否需要重定向（用于redirect.js）
// 返回对象包含：shouldRedirect(是否需要重定向), message(文案), isWorkingTime(是否上班时间)
export function checkRedirectCondition(overtimeStatus = false) {
    const workingTimeInfo = checkWorkingTime();
    
    // 只有在非上班时间且加班开关关闭时才需要重定向
    const shouldRedirect = !workingTimeInfo.isWorkingTime && overtimeStatus !== true;
    
    return {
        shouldRedirect: shouldRedirect,
        message: workingTimeInfo.message,
        isWorkingTime: workingTimeInfo.isWorkingTime,
        holiday: workingTimeInfo.holiday,
        isWeekend: workingTimeInfo.isWeekend
    };
}

// 获取当前日期时间格式化字符串
export function getCurrentDateTime() {
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth() + 1;
    const nowDay = now.getDate();
    const nowHour = now.getHours();
    const nowMinute = now.getMinutes();
    const nowSecond = now.getSeconds();
    
    return `${nowYear} 年 ${nowMonth} 月 ${nowDay} 日 ${nowHour < 10 ? '0' + nowHour : nowHour}:${nowMinute < 10 ? '0' + nowMinute : nowMinute}:${nowSecond < 10 ? '0' + nowSecond : nowSecond}`;
}