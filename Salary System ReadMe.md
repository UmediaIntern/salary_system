---
title: Salary System ReadMe
tags: [Salary System, nodejs, typescript]

---

---
Topic: Salary System ReadMe
Author: Pony Wang
---

# Salary System ReadMe
網頁版：https://hackmd.io/@ponywang/ryvvP3xlee/edit
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
* 計算前點擊左上角設定**期別**及**發薪日期**
* TODO

<center>
    <img width=100% src="https://hackmd.io/_uploads/HJ3B-Txexx.png"/>
    <img width=50% src="https://hackmd.io/_uploads/H1zu3hxxex.png"/>
    <img width=40% src="https://hackmd.io/_uploads/ByIS23xggg.png"/>
</center>


## 同步
* 用來與EHR資料同步
    * 會將所需資料複製到本地，根據異動檔更新資料
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


    * 薪資檔案: TODO
    * 持股信託: TODO
    
    
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

## 報表
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
### 員工基本資料

| 項目 | 資料表 / 檢視表 | 程式碼位置 | 說明 |
|------|------------------|-----------|------|
| 基本資料 | `U_EMPLOYEE_DATA` | `src/server/database/entity/SALARY/employee_data.ts` | 員工編號、姓名、部門、工作狀態等與錢無關資料 |
| 薪資檔案 | `U_EMPLOYEE_PAYMENT` | `src/server/database/entity/SALARY/employee_payment.ts` | 包含底薪、津貼、勞健保等欄位 |
| 持股信托 | `U_EMPLOYEE_TRUST` | `src/server/database/entity/SALARY/employee_trust.ts` | 員工個人持股信託相關資料 |
### 請假加班資料
| 項目 | 資料表 / 檢視表 | 程式碼位置 | 說明 |
|------|------------------|-----------|------|
| 請假 | `U_HR_PAYDRAFT_HOLIDAYS_V` ||包含請假時數與假別ID(PAY_ORDER)等資料|
|請假類別|`U_HOLIDAYS_TYPE`| `src/server/database/entity/SALARY/holidays_type.ts`|假別ID、假別名稱與扣除倍率對照表|
| 加班 | `U_HR_PAYDRAFT_OVERTIME_V` ||包含各類型加班時數|
|加班倍率設定|`U_ATTENDANCE_SETTING`| `src/server/database/entity/SALARY/attendance_setting.ts` |包含本勞及外勞加班倍率|


###### tags: `Salary System` `nodejs` `typescript`
