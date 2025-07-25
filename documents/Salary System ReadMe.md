---
title: Salary System ReadMe
tags: [Salary System, nodejs, typescript]

---

---
Topic: Salary System ReadMe
Author: Pony Wang
---

# Salary System ReadMe

---

[TOC]

## [Installation]()
1. Download [node.js](<https://nodejs.org/zh-tw/download/>)
2. Install with x64 execution setup file
3. `npm --version`  (result should be like `10.9.0`)
4. `npm install -g yarn` 
5. `yarn --version` (result should be like 1.22.22)
6. cd to **salary system** directory
    Ex: `cd C:\Users\salary\Desktop\salary_system`
7. Install the required package for **salary system** with `yarn install`

:::warning
:bulb: If the shell stalls for a long time, press enter to see if it's still working
:::

## Restart System
* In powershell, run the command 
    ``` bash
    cd C:\Users\salary\Desktop\salary_system
    yarn install
    yarn dev
    ```
## 專案目錄總覽（Next.js + tRPC 專案）

```plaintext
src/
├── pages/                       # 前端頁面（route 基於檔案）
│   ├── index.tsx               # 首頁
│   ├── _app.tsx                # App 設定入口
│   ├── login/                  # 登入頁面
│   ├── employees/             # 員工管理模組
│   ├── bonus/                 # 獎金模組（含試算、結算）
│   ├── calendar/              # 年度行事曆與月檢視
│   ├── report/                # PDF / 輸出報表模組
│   ├── import/                # Excel 匯入、視覺化對應
│   ├── synchronize/           # 同步與資料對齊工具
│   ├── parameters/            # 參數設定（如等級、職務）
│   ├── functions/             # 月薪邏輯與相關元件
│   ├── data_export/           # 資料匯出模組
│   ├── roles/                 # 權限角色管理
│   ├── profile/               # 使用者個人資料設定
│   └── test/                  # 測試用頁面與檔案
│
├── server/                     # 後端邏輯（tRPC 架構）
│   ├── api/                   # tRPC routers、types、helper
│   ├── database/              # DB client / entity / mapper / 建表腳本
│   ├── service/               # 各類服務函式（資料庫操作、商業邏輯）
│   └── errors/                # 自訂錯誤處理（含 parser、access denied 等）
│
├── components/                 # UI 與功能元件（大量共用元件）
│   ├── ui/                    # 原子元件（如 Button、Tabs、Toast）
│   ├── form/                  # 表單元件組件
│   ├── layout/                # 每頁共用 layout 元件
│   ├── nav_sidebar/           # 側邊欄組件
│   ├── file_operations/       # Excel 處理、上傳、預覽、驗證工具
│   ├── data_table/            # 資料表元件（含分頁、toolbar 等）
│   ├── functions/             # 功能元件（如進度條、卡片函式）
│   ├── synchronize/           # 同步用元件（選人、選部門、切換模式）
│   ├── table_functions/       # 表格功能組件（含 confirm dialog、function menu）
│   ├── query_boundary/        # 非同步資料的邊界處理
│   ├── context/               # React Context（提供 Access / Period 等）
│   └── hooks/                 # 共用 Hooks（如 mobile 判斷、離開提示）
│
├── lib/                        # 工具函式與 utils
│   ├── utils/                 # 常用函式（日期處理、型別檢查、i18n 等）
│   └── utils.ts              # 公用工具入口或 aggregator
│
├── styles/                     # 全域樣式（含 Tailwind CSS）
│   └── globals.css
│
├── utils/                      # 舊版或另類工具模組（如 sessionStorage 操作）
│
├── middleware.ts               # Next.js Middleware 設定
├── env.mjs                     # 環境變數處理
├── instrumentation.ts          # 錯誤追蹤或 APM 工具初始化
```
## Login
* Login at `localhost:3000`
    * http://localhost:3000/zh-TW/login
<center>
    <img width=60% src="https://hackmd.io/_uploads/B10I5hlgle.png"/>
</center>

## 計算薪資
<center>
    <img width=60% src="https://hackmd.io/_uploads/HkgPj3lxxx.png"/>
</center>

* 5大功能
    * 月薪
    * 15日外勞獎金
    * 持股信託
    * 季獎金
    * 員工分紅
* 計算前點擊左上角設定**期別**會自動帶出該期別發薪日期
* TODO

<center>
    <img width=100% src="https://hackmd.io/_uploads/HJ3B-Txexx.png"/>
    <img width=50% src="https://hackmd.io/_uploads/H1zu3hxxex.png"/>
    <img width=40% src="https://hackmd.io/_uploads/ByIS23xggg.png"/>
</center>


## 同步
* 用來與EHR資料同步
    * 若本月無資料會先將上月資料經過基本修改（如當月離職人員改為離職人員）複製到本月，根據異動檔同步其他需更新資料
    * 如果選擇期別有異動，則會出現類似下圖結果
        * 左上角可以選擇**全部員工/選擇部門/選擇員工**來篩選資料
            * 如果使用**選擇部門/選擇員工**，可以進一步選擇特定**員工/部門**
        * 右上角可以選擇**僅顯示變更資料/顯示所有資料**
            * 有變更的欄位會以<font color="#f00">紅字</font>顯示
<center>
    <img width=45% src="https://hackmd.io/_uploads/rJ99Thxelx.png"/>   
    <img width=45% src="https://hackmd.io/_uploads/BkPz1alleg.png"/>
</center>
    
* 使用方式:
    * 確認資料: 還不會實際更新
        * 透過點擊**確認修改**來確認某員工該欄位的數值
        * 最右邊欄位**全選/取消全選**可以直接確認該員工所有欄位
    * 更新資料
        * 點擊右下確定跳出更新視窗
        * 已確認的資料(欄位)會被勾選，如果確定沒問題可點擊下方的**修正**，點擊後本系統資料將被更新與EHR資料同步
<center>
    <img width=70% src="https://hackmd.io/_uploads/ry8Zgpexxx.png"/>
    <img width=100% src="https://hackmd.io/_uploads/BJNne6xgxe.png"/>
</center>

## 員工
* 可以搜尋特定員工、篩選員工發薪狀態及欄位顯示
<center>
    <img width=60% src="https://hackmd.io/_uploads/HyMcXG-gle.png"/>
</center>

* 可以透過統計資料來看欄位的統計結果
<center>
    <img width=60% src="https://hackmd.io/_uploads/HJQHQMWxll.png"/>
</center>

* 總共有三個頁面
    * 基本資料: 來自EHR系統，為不可於薪資系統更改的資料，資料來源詳情請見[**同步**](##同步)


    <center>
        <img width=60% src="https://hackmd.io/_uploads/BkqnWplexg.png"/>
    </center>


    * 薪資檔案: 記錄與薪資相關的所有員工欄位，支援統一更新基本底薪與勞健保級距（位於右上角控制區）。
        * 每筆資料的生效區間由系統自動管理，根據新資料的開始日期，自動將前一筆資料的結束日期設為新開始日前一天。使用者不得手動設定結束日期，以確保資料區間不重疊、無缺口。
        * 勞健保級距調整時可指定生效日期；在該日期生效前，系統將暫時保留原有的薪資與級距不一致的狀態。
        * 調整基本薪資時，系統會檢查每位員工的經常性薪資（底薪 + 伙食津貼 + 全勤獎金）。若低於設定的新基本工資，則會自動將該員工的底薪調高，使經常性薪資達到基本工資標準。
    * 持股信託: 呈現所有參加持股信託的員工及所對應的金額
        * 不支援暫停功能，若要暫停僅可將員工信託金金額設為0
        * 支援手動設定每筆資料的開始與截止日期，系統會根據新增資料，自動調整前後資料生效區間，確保時間區段連貫不重疊。
            * **範例**：  
                原資料：`2025-01-01 起，信託金 500`  
                若新增資料：`2025-11-01 ~ 2025-11-30，信託金 0（暫停）`  
                系統將調整為：

                1. `2025-01-01 ~ 2025-10-31`，信託金 500  
                2. `2025-11-01 ~ 2025-11-30`，信託金 0  
                3. `2025-12-01 起`，信託金 500
    
    
## 參數
* 儲存**選擇期別**的參數，會用於[**計算薪資**](#計算薪資)
    * 請假加班
    * 銀行
    * 勞健保費率
    * 信託金
    * 級距
    * 級距類別範圍
    * 薪資所得稅
    * 薪資所得稅設定
* 新增/更新
    * <font color="#f00">無法刪除</font>，會根據設定時間來更改已有資料的開始時間及截止時間自動排程
    * 可透過 **Excel 上傳**/**建立** 來更新啟用參數 
        * Excel 上傳: 模板可透過 **Excel 下載** 取得，更改完數值上傳即可)
        * 建立: 直接於跳出視窗更改數值，少量欄位操作時適用
<center>
    <img width="25%" src="https://hackmd.io/_uploads/BknzIMWggg.png">
    <img width="30%" src="https://hackmd.io/_uploads/rkk-8G-ell.png">
    <img width="40%" src="https://hackmd.io/_uploads/SyRJDG-egl.png">
    <img width="100%" src="https://hackmd.io/_uploads/rJhD8M-eel.png">
</center>

## 獎金
* 兩階段 (要到第二階段全部執行完才會實際更新資料): 
    <center>
        <img width="45%" src="https://hackmd.io/_uploads/B1R7YzZxee.png">
        <img width="45%" src="https://hackmd.io/_uploads/BJRYcfWexe.png">
    </center>
        
    * 匯出預算金額，等待主管核准
        * 獎金篩選及特殊倍率設定
            * 可以針對不同員工屬性(部門、職等 etc)來給予不同倍率
        * 獎金預算計算
            * 列出符合發放獎金名單
            * 計算獎金預算金額
        * 匯出Excel (有空白欄位等待主管填寫)
    * 重新匯入並確認
        * 匯入Excel
        * 最終確認

## 資料匯出
* 產生薪資異動檔 (根據選擇**期別**)
    * Keys: 可選擇顯示那些欄位 (下載下來會跟隨設定)
    * 可以透過點擊`Download`來下載薪資異動Excel檔案
![image](https://hackmd.io/_uploads/rk2wvaeegl.png)

## 設定
* 目前有的功能:
    * 更改語言 (中文/英文)
    * 更改密碼
    * 更改亮暗模式
## 資料來源總覽
### 員工

| 項目 | 資料表 / 檢視表 | 程式碼位置 | 說明 |
|------|------------------|-----------|------|
| 基本資料 | `U_EMPLOYEE_DATA` | `src/server/database/entity/SALARY/employee_data.ts` | 員工編號、姓名、部門、工作狀態等與錢無關資料，每月存一份且與EHR U_HR_PAYDRAFT_EMP_V中存的差異同步 |
| 薪資檔案 | `U_EMPLOYEE_PAYMENT` | `src/server/database/entity/SALARY/employee_payment.ts` | 包含底薪、津貼、勞健保等欄位，若有 |
| 持股信托 | `U_EMPLOYEE_TRUST` | `src/server/database/entity/SALARY/employee_trust.ts` | 員工個人持股信託相關資料 |

### 參數
<!-- | 請假 | `U_HR_PAYDRAFT_HOLIDAYS_V` ||包含請假時數與假別ID(PAY_ORDER)等資料|
|請假類別|`U_HOLIDAYS_TYPE`| `src/server/database/entity/SALARY/holidays_type.ts`|假別ID、假別名稱與扣除倍率對照表|
| 加班 | `U_HR_PAYDRAFT_OVERTIME_V` ||包含各類型加班時數| -->
| 項目 | 資料表 / 檢視表 | 程式碼位置 | 說明 |
|------|------------------|-----------|------|
|請假加班|`U_ATTENDANCE_SETTING`| `src/server/database/entity/SALARY/attendance_setting.ts` |包含本勞及外勞加班倍率|
|銀行|`U_BANK_SETTING`| `src/server/database/entity/SALARY/bank_setting.ts` |設定銀行及公司名稱、代碼等資料|
|勞健保費率|`U_INSURANCE_RATE_SETTING`| `src/server/database/entity/SALARY/insurance_rate_setting.ts` |設定勞健保相關費率|
|信託金|`U_TRUST_MONEY`| `src/server/database/entity/SALARY/trust_money.ts` |設定職等職級與信託金上限對照表|
|級距|`U_LEVEL`| `src/server/database/entity/SALARY/level.ts` |維護勞健保級距數字|
|級距類別範圍|`U_LEVEL_RANGE`| `src/server/database/entity/SALARY/level_range.ts` |設定勞健保類別對應上下限|
|薪資所得稅|`U_SALARY_INCOME_TAX`| `src/server/database/entity/SALARY/salary_income_tax.ts` |維護薪資所得稅對照表|
|薪資所得稅設定|`U_INCOME_TAX_SETTING`| `src/server/database/entity/SALARY/income_tax_setting.ts` |設定免稅額、入境天數門檻等參數|
|工作津貼範圍|`U_ALLOWANCE_RANGE`| `src/server/database/entity/SALARY/allowance_range.ts` |設定職等職級與津貼上限對照表（缺職稱|

### 獎金
| 項目 | 資料表 / 檢視表 | 程式碼位置 | 說明 |
|------|------------------|-----------|------|
| 獎金全部 | `U_BONUS_ALL`|`src/server/database/entity/SALARY/bonus_all.ts` |設定全公司共同基礎獎金倍率|
| 獎金工作類別 | `U_BONUS_WORKTYPE`|`src/server/database/entity/SALARY/bonus_work_type.ts` |設定特定工作類別對應獎金倍率|
| 獎金部門 | `U_BONUS_DEPARTMENT`|`src/server/database/entity/SALARY/bonus_department.ts` |設定特定部門對應獎金倍率|
| 獎金職等職級 | `U_BONUS_POSITION`|`src/server/database/entity/SALARY/bonus_position.ts` |設定特定職等職級對應獎金倍率|
| 獎金年資 | `U_BONUS_SENIORITY`|`src/server/database/entity/SALARY/bonus_seniority.ts` |設定特定年資（滿）對應獎金倍率（ex:年資3.6年員工會對應到3年年資的獎金倍率，不會對到4年或2年等倍率）|
| 員工獎金 | `U_EMPLOYEE_BONUS`|`src/server/database/entity/SALARY/employee_bonus.ts` |包含專案、Ｑ1、Q2員紅等由薪資系統維護之獎金預算及核准金額資料|
## 未完成事項
tRPC failed on employeePayment.createEmployeePayment: [
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": [
      "bank_account_foreign"
    ],
    "message": "Required"
  }


###### tags: `Salary System` `nodejs` `typescript`
