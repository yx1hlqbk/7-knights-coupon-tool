// ==================== 配置 ====================
const CONFIG = {
    // 驗證 API（GET）
    VERIFY_API_URL: 'https://coupon.netmarble.com/api/coupon/reward',
    // 兌換 API（POST）
    REDEEM_API_URL: 'https://coupon.netmarble.com/api/coupon',
    GAME_CODE: 'tskgb',
    LANG_CODE: 'ZH_TW',
    // CORS 代理（已啟用以解決跨域問題）
    CORS_PROXY: 'https://api.allorigins.win/raw?url=',
};

// ==================== 狀態管理 ====================
const state = {
    pid: '',
    coupons: [],
    results: [],
    isProcessing: false,
};

// ==================== DOM 元素 ====================
const elements = {
    pidInput: document.getElementById('pid'),
    couponsTextarea: document.getElementById('coupons'),
    couponCount: document.getElementById('couponCount'),
    verifyBtn: document.getElementById('verifyBtn'),
    redeemBtn: document.getElementById('redeemBtn'),
    clearBtn: document.getElementById('clearBtn'),
    resultsSection: document.getElementById('resultsSection'),
    resultsList: document.getElementById('resultsList'),
    stats: document.getElementById('stats'),
    corsWarning: document.getElementById('corsWarning'),
};

// ==================== 初始化 ====================
function init() {
    // 事件監聽器
    elements.pidInput.addEventListener('input', handlePidInput);
    elements.couponsTextarea.addEventListener('input', handleCouponsInput);
    elements.verifyBtn.addEventListener('click', handleVerify);
    elements.redeemBtn.addEventListener('click', handleRedeem);
    elements.clearBtn.addEventListener('click', handleClear);

    // 初始化狀態
    updateCouponCount();
}

// ==================== 事件處理 ====================
function handlePidInput(e) {
    state.pid = e.target.value.trim();
    updateButtonStates();
}

function handleCouponsInput(e) {
    updateCouponCount();
    updateButtonStates();
}

function updateCouponCount() {
    const text = elements.couponsTextarea.value.trim();
    const coupons = text ? text.split('\n').filter(c => c.trim()) : [];
    elements.couponCount.textContent = `${coupons.length} 組`;
}

function updateButtonStates() {
    const hasPid = state.pid.length > 0;
    const hasCoupons = elements.couponsTextarea.value.trim().length > 0;

    elements.verifyBtn.disabled = !hasPid || !hasCoupons || state.isProcessing;

    // 只有在有驗證結果且有成功的序號時才啟用兌換按鈕
    const hasValidCoupons = state.results.some(r => r.status === 'success');
    elements.redeemBtn.disabled = !hasValidCoupons || state.isProcessing;
}

async function handleVerify() {
    if (state.isProcessing) return;

    // 解析序號
    const text = elements.couponsTextarea.value.trim();
    const coupons = text.split('\n').filter(c => c.trim()).map(c => c.trim());

    if (coupons.length === 0) {
        alert('請輸入至少一組序號');
        return;
    }

    state.isProcessing = true;
    state.coupons = coupons;
    state.results = coupons.map(code => ({
        code,
        status: 'pending',
        message: '等待驗證...',
    }));

    updateButtonStates();
    renderResults();
    elements.resultsSection.style.display = 'block';

    // 批次驗證
    for (let i = 0; i < state.results.length; i++) {
        await verifyCoupon(i);
        await sleep(500); // 避免請求過快
    }

    state.isProcessing = false;
    updateButtonStates();
}

async function handleRedeem() {
    if (state.isProcessing) return;

    const validResults = state.results.filter(r => r.status === 'success');

    if (validResults.length === 0) {
        alert('沒有可兌換的序號');
        return;
    }

    const confirmed = confirm(`確定要兌換 ${validResults.length} 組序號嗎？`);
    if (!confirmed) return;

    state.isProcessing = true;
    updateButtonStates();

    // 批次兌換
    for (let i = 0; i < state.results.length; i++) {
        if (state.results[i].status === 'success') {
            await redeemCoupon(i);
            await sleep(500); // 避免請求過快
        }
    }

    state.isProcessing = false;
    updateButtonStates();
}

function handleClear() {
    if (state.isProcessing) {
        alert('處理中，無法清除');
        return;
    }

    const confirmed = confirm('確定要清除所有資料嗎？');
    if (!confirmed) return;

    elements.pidInput.value = '';
    elements.couponsTextarea.value = '';
    state.pid = '';
    state.coupons = [];
    state.results = [];

    elements.resultsSection.style.display = 'none';
    elements.corsWarning.style.display = 'none';
    updateCouponCount();
    updateButtonStates();
}

// ==================== API 呼叫 ====================
async function verifyCoupon(index) {
    const result = state.results[index];
    result.status = 'processing';
    result.message = '驗證中...';
    renderResults();

    try {
        const url = buildApiUrl(result.code, 'verify');
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok && !data.errorCode) {
            result.status = 'success';
            result.message = '序號有效，可以兌換';
            result.data = data;
        } else {
            result.status = 'error';
            result.message = parseErrorMessage(data);
        }
    } catch (error) {
        result.status = 'error';
        result.message = handleApiError(error);
    }

    renderResults();
}

async function redeemCoupon(index) {
    const result = state.results[index];
    result.status = 'processing';
    result.message = '兌換中...';
    renderResults();

    try {
        const url = buildApiUrl(result.code, 'redeem');
        const payload = {
            gameCode: CONFIG.GAME_CODE,
            couponCode: result.code,
            langCd: CONFIG.LANG_CODE,
            pid: state.pid,
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        // 檢查是否成功（errorCode 200 或 success: true）
        if (data.success === true || data.errorCode === 200) {
            result.status = 'success';
            result.message = formatSuccessMessage(data);
            result.data = data;
        } else {
            result.status = 'error';
            result.message = parseErrorMessage(data);
        }
    } catch (error) {
        result.status = 'error';
        result.message = handleApiError(error);
    }

    renderResults();
}

// ==================== 輔助函數 ====================
function buildApiUrl(couponCode, type = 'verify') {
    let apiUrl;

    // 驗證 API 使用 GET，需要 query parameters
    if (type === 'verify') {
        const params = new URLSearchParams({
            gameCode: CONFIG.GAME_CODE,
            couponCode: couponCode,
            langCd: CONFIG.LANG_CODE,
            pid: state.pid,
        });
        apiUrl = `${CONFIG.VERIFY_API_URL}?${params.toString()}`;
    } else {
        // 兌換 API 使用 POST
        apiUrl = CONFIG.REDEEM_API_URL;
    }

    // 如果有 CORS 代理，需要對 URL 進行編碼
    if (CONFIG.CORS_PROXY) {
        return CONFIG.CORS_PROXY + encodeURIComponent(apiUrl);
    }

    return apiUrl;
}

function parseErrorMessage(data) {
    if (!data.errorCode) return '未知錯誤';

    const errorMessages = {
        24004: '❌ 序號已使用或超過兌換次數',
        24001: '❌ 無效的序號',
        24002: '❌ 序號已過期',
        24003: '❌ 序號尚未開始',
        24005: '❌ 該帳號已兌換過此序號',
        24006: '❌ 序號不適用於此遊戲',
    };

    const message = errorMessages[data.errorCode] || `❌ 錯誤 ${data.errorCode}`;

    if (data.errorMessage) {
        return `${message} (${data.errorMessage})`;
    }

    return message;
}

function formatSuccessMessage(data) {
    let message = '✅ 兌換成功！';

    // 如果有 resultData，顯示獲得的物品數量
    if (data.resultData && Array.isArray(data.resultData)) {
        const itemCount = data.resultData.length;
        message += ` 獲得 ${itemCount} 項物品`;
    }

    // 如果有 errorMessage（成功訊息）
    if (data.errorMessage) {
        message += ` - ${data.errorMessage}`;
    }

    return message;
}

function handleApiError(error) {
    console.error('API Error:', error);

    // 檢測 CORS 錯誤
    if (error.message.includes('CORS') || error.message.includes('fetch')) {
        elements.corsWarning.style.display = 'block';
        return '❌ CORS 限制：無法連接 API（請參考上方警告）';
    }

    return `❌ 網路錯誤：${error.message}`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== UI 渲染 ====================
function renderResults() {
    elements.resultsList.innerHTML = '';

    state.results.forEach((result, index) => {
        const item = createResultItem(result, index);
        elements.resultsList.appendChild(item);
    });

    updateStats();
}

function createResultItem(result, index) {
    const div = document.createElement('div');
    div.className = `result-item status-${result.status}`;

    const statusText = {
        pending: '待處理',
        processing: '處理中',
        success: '成功',
        error: '失敗',
    };

    div.innerHTML = `
        <div class="result-header">
            <span class="coupon-code">${result.code}</span>
            <span class="status-badge ${result.status}">${statusText[result.status]}</span>
        </div>
        <div class="result-message">${result.message}</div>
    `;

    return div;
}

function updateStats() {
    const total = state.results.length;
    const success = state.results.filter(r => r.status === 'success').length;
    const error = state.results.filter(r => r.status === 'error').length;
    const pending = state.results.filter(r => r.status === 'pending' || r.status === 'processing').length;

    elements.stats.innerHTML = `
        <span class="stat stat-total">總計: <strong>${total}</strong></span>
        <span class="stat stat-success">成功: <strong>${success}</strong></span>
        <span class="stat stat-error">失敗: <strong>${error}</strong></span>
        <span class="stat stat-pending">待處理: <strong>${pending}</strong></span>
    `;
}

// ==================== 啟動應用 ====================
document.addEventListener('DOMContentLoaded', init);
