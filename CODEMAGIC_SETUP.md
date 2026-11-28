# 用 Codemagic 把「泡麵家親子股海」送到 TestFlight

這份說明是給沒有 Mac 的家長。照順序點就好。金鑰檔（.p8）只放在 Codemagic 網站上，不要傳進 GitHub。

App 顯示名稱：泡麵家親子股海  
Bundle ID：`com.aniki1413.paomianstock`  
版本：1.0.0（組建號碼由 Codemagic 依 TestFlight 最新號自動加一）

## 1. 先在 Apple 建立這支 App

1. 用 Apple 開發者帳號打開 [App Store Connect](https://appstoreconnect.apple.com)。
2. 點「我的 App」→「+」→「新增 App」。
3. 平台選 iOS。
4. 名稱填「泡麵家親子股海」。
5. 主要語言選「繁體中文」。
6. 套件 ID 選 `com.aniki1413.paomianstock`。如果清單裡沒有，先到 [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list) 新增 App ID，Bundle ID 填同一個，再回來選。
7. SKU 可填 `paomianstock`（只是你自己辨認用，不會顯示給玩家）。
8. 使用者存取權限選「完整存取權限」。
9. 建立後先不要送審。類別之後選「教育」，年齡分級選 4+。不要勾「兒童類別」（Made for Kids）。原因寫在這份說明最下面。

## 2. 確認 API 金鑰（你已經有的那一把）

1. App Store Connect →「使用者與存取權限」→「整合」→「App Store Connect API」。
2. 發行者 ID 應為 `b74240b4-aec9-428b-997c-840d442b4447`。
3. 金鑰 ID 應為 `RW4D5W9BZG`。
4. 權限要是「App 管理」或「管理」。若這把金鑰權限不夠，請另外做一把，並下載只能下載一次的 `.p8` 檔。
5. `.p8` 請另外備份在自己的電腦，不要貼到聊天室或 GitHub。

## 3. 在 Codemagic 加入整合（名稱一定要叫 codemagic_asc）

1. 打開 [Codemagic](https://codemagic.io) 並登入。請用個人帳號（免費方案有 Mac mini M2 的分鐘數；團隊帳號沒有這 500 分鐘）。
2. 左側若有團隊切換，選你的個人帳號，不要選要付費的 Team。
3. 點右上角個人圖示，或左側「Teams」旁的設定，進入「Team settings」／個人設定。
4. 找到「Integrations」→「Developer Portal」→「Apple Developer Portal」或「App Store Connect」。
5. 點「Connect」或「Add key」。
6. 名稱（Integration name）填：`codemagic_asc`（要跟程式裡的名字一模一樣）。
7. Issuer ID 貼上：`b74240b4-aec9-428b-997c-840d442b4447`
8. Key ID 貼上：`RW4D5W9BZG`
9. 上傳 `.p8` 檔（或把檔案內容貼進私鑰欄位，看畫面要求哪一種）。
10. 儲存。

## 4. 把這個 GitHub 專案加進 Codemagic

1. Codemagic 首頁點「Add application」。
2. 選 GitHub，授權後選這個專案（paomian-stock-school）。
3. 專案類型選「其他」或「React」都可以。完成新增。
4. 打開這個應用程式，上方選分支（合併後用 `main`；審查中的分支也可以先試）。
5. 點「Check for configuration file」，讓它讀到專案裡的 `codemagic.yaml`。
6. 工作流程清單應出現：
   - **iOS TestFlight（泡麵家親子股海）** ← 要按這個
   - Android 除錯 AAB（debug 簽章，不能上架）← 這是練習用，不能拿去 Google Play

## 5. 開始建置並送到 TestFlight

1. 選「iOS TestFlight（泡麵家親子股海）」。
2. 點「Start new build」。
3. 等它跑完（第一次可能比較久，要下載套件並編譯）。免費方案每個月有 500 分鐘，用在 M2 Mac mini。
4. 成功後，App Store Connect → 這支 App → TestFlight，會看到新的組建。組建號碼會比上一次 TestFlight 大 1。第一次沒有舊組建時，號碼是 1。
5. 用 iPhone 安裝 TestFlight App，登入同一個 Apple ID，就能安裝來玩。

## 還沒做、要你自己在網站上填的

送審給所有人下載之前，App Store Connect 還要：

- 隱私權政策網址（即使 App 不收集個資，也要有一頁說明「不收集個人資料」）。
- iPhone 截圖（6.7 吋與 6.5 吋，或 Apple 當下要求的尺寸）。
- 類別：教育。年齡分級問卷選最低、沒有不受限制的網頁、沒有賭博。
- 出口合規：這支 App 已在程式裡註明不使用額外加密，通常不用再填。
- 定價選免費。

## 請不要勾「兒童類別」

這是給家人一起玩的教育遊戲，年齡分級用 4+ 即可。遊戲裡的贊助按鈕會先問過，再打開 Facebook。Apple 的「兒童類別」幾乎不允許離開 App 或放外部連結，勾了很容易被退件。不要勾。

## Android 那個流程

「Android 除錯 AAB」做出來的檔案是 debug 簽章，只能自己安裝看看，不能上傳 Google Play。要上架還需要另外做正式簽章金鑰，這次先不做。
