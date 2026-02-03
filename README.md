# 七騎士序號兌換系統

一個簡易的網頁應用程式，用於批次驗證和兌換七騎士遊戲序號。

## 🎯 功能特色

- ✅ 批次驗證多組序號
- ✅ 自動兌換有效序號
- ✅ 即時顯示處理狀態
- ✅ 詳細的錯誤訊息
- ✅ 響應式設計（支援手機/平板/桌面）
- ✅ 深色主題與現代化 UI

## 📦 檔案結構

```
7king-serial-number/
├── index.html    # 主頁面
├── style.css     # 樣式表
├── script.js     # 核心邏輯
└── README.md     # 說明文件
```

## 🚀 使用方法

### 1. 開啟應用程式

直接在瀏覽器中開啟 `index.html` 檔案：
- 雙擊檔案
- 或在瀏覽器中按 `Ctrl+O` 選擇檔案

### 2. 輸入資料

1. **會員號碼（PID）**：輸入您的七騎士會員號碼
   - 例如：`D3AC10BF183946438EFA9D4941BD1414`

2. **序號列表**：輸入要兌換的序號，每行一個
   ```
   CHLOEMAYALICE
   EXAMPLE123
   TESTCODE456
   ```

### 3. 驗證序號

點擊「🔍 驗證序號」按鈕：
- 系統會逐一檢查每組序號的有效性
- 顯示每個序號的狀態（有效/無效/已使用）

### 4. 批次兌換

驗證完成後，點擊「✨ 批次兌換」按鈕：
- 系統會自動兌換所有有效的序號
- 顯示兌換結果

### 5. 查看結果

結果區域會顯示：
- 📊 統計資訊（總計/成功/失敗/待處理）
- 📝 每個序號的詳細狀態和訊息

## ⚠️ 重要提醒

### CORS 限制問題

由於瀏覽器的安全限制（CORS），直接從本地檔案呼叫 Netmarble API 可能會被阻擋。

#### 解決方案：

**方案 1：使用瀏覽器擴充功能（最簡單）**

安裝 CORS 解除限制的擴充功能：
- Chrome：[CORS Unblock](https://chrome.google.com/webstore/detail/cors-unblock)
- Firefox：[CORS Everywhere](https://addons.mozilla.org/firefox/addon/cors-everywhere/)
- Edge：[CORS Unblock](https://microsoftedge.microsoft.com/addons/detail/cors-unblock)

**方案 2：使用本地伺服器**

使用 Python 啟動本地伺服器：
```bash
# Python 3
python -m http.server 8000

# 然後在瀏覽器開啟
http://localhost:8000
```

**方案 3：修改程式碼使用 CORS 代理**

編輯 `script.js`，找到 `CONFIG` 區塊：
```javascript
const CONFIG = {
    API_BASE_URL: 'https://coupon.netmarble.com/api/coupon/reward',
    GAME_CODE: 'tskgb',
    LANG_CODE: 'ZH_TW',
    // 啟用 CORS 代理
    CORS_PROXY: 'https://cors-anywhere.herokuapp.com/',
};
```

> **注意**：公開的 CORS 代理服務可能有使用限制或不穩定。

## 📱 響應式設計

應用程式支援各種螢幕尺寸：
- 📱 手機（< 480px）
- 📱 平板（480px - 768px）
- 💻 桌面（> 768px）

## 🎨 UI 設計

- **深色主題**：減少眼睛疲勞
- **漸層效果**：現代化視覺體驗
- **狀態顏色**：
  - 🔵 藍色：處理中
  - 🟢 綠色：成功
  - 🔴 紅色：失敗
  - ⚪ 灰色：待處理

## 🔧 技術細節

### API 端點

**驗證序號（GET）**
```
https://coupon.netmarble.com/api/coupon/reward?gameCode=tskgb&couponCode={序號}&langCd=ZH_TW&pid={會員號碼}
```

**兌換序號（POST）**
```
端點: https://coupon.netmarble.com/api/coupon
方法: POST
Content-Type: application/json

Payload:
{
    "gameCode": "tskgb",
    "couponCode": "{序號}",
    "langCd": "ZH_TW",
    "pid": "{會員號碼}"
}

成功回應範例:
{
    "errorCode": 200,
    "errorMessage": "아이템이 지급되었습니다.",
    "resultData": [
        {
            "slotNumber": 1,
            "groupProductId": "...",
            "quantity": 1
        }
    ],
    "success": true
}
```

### 錯誤碼說明

| 錯誤碼 | 說明 |
|--------|------|
| 24001 | 無效的序號 |
| 24002 | 序號已過期 |
| 24003 | 序號尚未開始 |
| 24004 | 序號已使用或超過兌換次數 |
| 24005 | 該帳號已兌換過此序號 |
| 24006 | 序號不適用於此遊戲 |

## 🛠️ 自訂設定

### 修改延遲時間

編輯 `script.js`，找到 `sleep(500)` 並調整毫秒數：
```javascript
await sleep(500); // 500ms = 0.5秒
```

### 修改語言

編輯 `script.js` 的 `CONFIG`：
```javascript
LANG_CODE: 'ZH_TW',  // 繁體中文
// LANG_CODE: 'ZH_CN',  // 簡體中文
// LANG_CODE: 'EN_US',  // 英文
```

### 啟用 CORS 代理

如果遇到 CORS 問題，可以編輯 `script.js` 啟用代理：
```javascript
const CONFIG = {
    VERIFY_API_URL: 'https://coupon.netmarble.com/api/coupon/reward',
    REDEEM_API_URL: 'https://coupon.netmarble.com/api/coupon',
    GAME_CODE: 'tskgb',
    LANG_CODE: 'ZH_TW',
    CORS_PROXY: 'https://cors-anywhere.herokuapp.com/', // 啟用代理
};
```

## 📝 使用範例

### 範例 1：單一序號驗證

1. 輸入 PID：`D3AC10BF183946438EFA9D4941BD1414`
2. 輸入序號：`CHLOEMAYALICE`
3. 點擊「驗證序號」
4. 查看結果

### 範例 2：批次兌換

1. 輸入 PID：`D3AC10BF183946438EFA9D4941BD1414`
2. 輸入多組序號：
   ```
   CODE001
   CODE002
   CODE003
   ```
3. 點擊「驗證序號」
4. 等待驗證完成
5. 點擊「批次兌換」
6. 查看兌換結果

## ⚡ 效能建議

- 建議每次處理不超過 20 組序號
- 序號之間有 500ms 延遲，避免 API 限流
- 如遇到網路錯誤，請稍後再試

## 🔒 安全性

- 所有資料僅在瀏覽器本地處理
- 不會儲存或上傳任何個人資料
- 直接與 Netmarble 官方 API 通訊

## 📞 常見問題

### Q: 為什麼顯示 CORS 錯誤？
A: 這是瀏覽器的安全限制。請參考「CORS 限制問題」章節的解決方案。

### Q: 序號驗證失敗怎麼辦？
A: 檢查序號是否正確、是否已過期、或是否已被使用。

### Q: 可以一次兌換多少組序號？
A: 技術上沒有限制，但建議每次不超過 20 組，避免 API 限流。

### Q: 兌換失敗會怎樣？
A: 系統會顯示詳細的錯誤訊息，不會影響其他序號的兌換。

## 📄 授權

僅供個人使用，請勿用於商業用途。

## 🙏 致謝

感謝 Netmarble 提供七騎士遊戲和序號兌換 API。

---

**版本**：1.0.0  
**更新日期**：2026-02-03  
**作者**：Antigravity AI
