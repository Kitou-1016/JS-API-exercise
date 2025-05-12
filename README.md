這是一個使用者點擊上方 Tag 後，取得對應資料的網站。

整體網頁的構思與架構是在網路上學習到的，我藉由這個專案來練習API串接 & 畫面渲染 & 操作網址變更的練習，

使用到了 window.location 方式操作跟網址有關的屬性

・使用者點擊選項，下方渲染內容

・JS檔案分開，避免程式碼混亂，打API一支.js 網址操作一支.js

・打API拿資料，使用.innerHTML 方式渲染到畫面上

・練習使用 window.location.search 取得 query 參數

・使用 new URLSearchParams 方式去解析 Unicode 編碼

・判斷網址是否有: ? & =

・使用 async/await 讓非同步變成同步

![image](https://github.com/user-attachments/assets/d35c6de8-10a1-40be-9bed-13231992c02b)
