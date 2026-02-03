# GitHub Pages 部署指南

## 📦 快速部署

### 步驟 1：建立 GitHub 儲存庫

1. 登入 [GitHub](https://github.com)
2. 點擊右上角的 `+` → `New repository`
3. 輸入儲存庫名稱（例如：`7king-serial-number`）
4. 選擇 `Public`（公開）
5. 點擊 `Create repository`

### 步驟 2：上傳檔案

**方法 A：使用 Git 命令列**

```bash
# 在專案目錄中初始化 Git
cd d:\test\7king-serial-number
git init

# 新增所有檔案
git add .

# 提交變更
git commit -m "Initial commit: 七騎士序號兌換系統"

# 連接到遠端儲存庫（替換成你的 GitHub 使用者名稱和儲存庫名稱）
git remote add origin https://github.com/[你的使用者名稱]/7king-serial-number.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

**方法 B：使用 GitHub 網頁介面**

1. 在儲存庫頁面點擊 `uploading an existing file`
2. 拖曳所有檔案到上傳區域：
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
   - `.gitignore`
3. 點擊 `Commit changes`

### 步驟 3：啟用 GitHub Pages

1. 進入儲存庫的 `Settings`（設定）
2. 在左側選單找到 `Pages`
3. 在 `Source` 下拉選單選擇 `main` 分支
4. 點擊 `Save`
5. 等待幾分鐘，頁面會顯示網址：
   ```
   https://[你的使用者名稱].github.io/7king-serial-number/
   ```

### 步驟 4：訪問應用程式

開啟瀏覽器，訪問：
```
https://[你的使用者名稱].github.io/7king-serial-number/
```

## ⚠️ CORS 限制處理

GitHub Pages 上使用時，仍需要處理 CORS 限制：

### 解決方案 1：瀏覽器擴充功能（推薦）

安裝以下任一擴充功能：
- **Chrome**: [CORS Unblock](https://chrome.google.com/webstore/detail/cors-unblock)
- **Firefox**: [CORS Everywhere](https://addons.mozilla.org/firefox/addon/cors-everywhere/)
- **Edge**: [CORS Unblock](https://microsoftedge.microsoft.com/addons/detail/cors-unblock)

### 解決方案 2：啟用 CORS 代理

編輯 `script.js`，修改配置：

```javascript
const CONFIG = {
    VERIFY_API_URL: 'https://coupon.netmarble.com/api/coupon/reward',
    REDEEM_API_URL: 'https://coupon.netmarble.com/api/coupon',
    GAME_CODE: 'tskgb',
    LANG_CODE: 'ZH_TW',
    CORS_PROXY: 'https://cors-anywhere.herokuapp.com/', // 啟用代理
};
```

> **注意**：公開的 CORS 代理可能有使用限制，建議優先使用瀏覽器擴充功能。

## 🔄 更新應用程式

當你修改程式碼後，更新 GitHub Pages：

```bash
# 新增變更
git add .

# 提交變更
git commit -m "更新說明"

# 推送到 GitHub
git push
```

GitHub Pages 會自動重新部署，通常需要 1-2 分鐘。

## 📱 分享給其他人

部署完成後，你可以將網址分享給其他人：
```
https://[你的使用者名稱].github.io/7king-serial-number/
```

**提醒使用者**：
1. 需要安裝 CORS 擴充功能才能正常使用
2. 或者你可以在 `script.js` 中預先啟用 CORS 代理

## 🎯 自訂網域（選用）

如果你有自己的網域，可以設定自訂網域：

1. 在儲存庫的 `Settings` → `Pages`
2. 在 `Custom domain` 輸入你的網域
3. 在網域的 DNS 設定中新增 CNAME 記錄：
   ```
   CNAME: [你的使用者名稱].github.io
   ```

## 🔒 安全性提醒

- 不要在程式碼中硬編碼個人的 PID
- 不要上傳包含個人資料的檔案
- `.gitignore` 已設定排除敏感檔案

## 📞 常見問題

### Q: 為什麼訪問網址顯示 404？
A: 請確認：
1. GitHub Pages 已啟用
2. 選擇了正確的分支（main）
3. 等待幾分鐘讓 GitHub 完成部署

### Q: 為什麼無法呼叫 API？
A: 這是 CORS 限制，請安裝瀏覽器擴充功能或啟用 CORS 代理。

### Q: 如何檢視部署狀態？
A: 在儲存庫頁面點擊 `Actions` 標籤，可以看到部署進度。

---

**完成！** 🎉

你的七騎士序號兌換系統現在已經部署到 GitHub Pages，可以在任何地方訪問使用了！
