//第4章：収支のデータをデータベースに記録
// データを記録するブログラムを記述

//indexedDBの名前などの設定
const dbName = 'kakeiboDB';
const storeName = 'kakeiboStore';
const dbVersion = 1;

//データベース接続する。データベースが未作成なら新規作成する。
let database = indexedDB.open(dbName,dbVersion);
//第一引数にDB名、第二にバージョン指定する事でDB作成できる
//変数に格納して他の処理で利用

//オブジェクトストアの作成
//database.onupgradeneededはDBの新規作成時またはバージョン変更時に1回だけ実行される関数
database.onupgradeneeded = function (event) {
    let db = event.target.result;
    //オブジェクトストアの作成
    //{ keyPath: "id" }はキー
    db.createObjectStore(storeName, { keyPath: "id" });
    console.log("データベースを新規作成しました");
}

//データベースに接続に成功した時に発生するイベント
database.onsuccess = function (event) { //eventにはDBそのものが入っている
    let db = event.target.result; //接続成功したDBのデータ＝入出金データ
    // 接続を解除する
    db.close();
    console.log("データベースに接続できました");
}
database.onerror = function (event) {
    console.log("データベースに接続できませんでした");
}

//フォームの内容をDBに登録する
function regist() {
    //フォームの入力チェック。falseが返却されたら登録処理を中断
    if (inputCheck() == false) {
        return;
    }
    //ラジオボタンの取得
    let radio = document.getElementsByName("balance");　//配列で支出・収入ボタン要素を受け取る
    let balance;
    for (let i = 0; i < radio.length; i++) {
        if (radio[i].checked == true) {
            balance = radio[i].value; //支出or収入
            break;
        }
    }

    //他の項目に入力された値を取得
    let date = document.getElementById("date").value;
    let amount = document.getElementById("amount").value;
    let memo = document.getElementById("memo").value;
    let category = document.getElementById("category").value;
    //ラジオボタンが収入を選択時はカテゴリを「収入」とする
    if (balance == "収入") {
        category = "収入";
    }
    //データベースにデータを登録する
    insertData(balance, date, category, amount, memo);
    //入手金一覧を作成
	createList();
}

//データの挿入
function insertData(balance, date, category, amount, memo) {
    //一意のIDを現在の日時から作成
    //getTime()はnew Dateで取得した時間をミリ秒単位で取得
    //toStringは値を文字列に変換（DBに登録するidは文字列じゃないとダメ）
    let uniqueID = new Date().getTime().toString();
    console.log(uniqueID);
    //DBに登録するための連想配列のデータを作成
    let data = {
        id: uniqueID,
        balance: balance,
        date: String(date),
        category: category,
        amount: amount,
        memo: memo,
    }

    //データベースを開く
    let database = indexedDB.open(dbName, dbVersion);

    //データベースの開けなかった時の処理
    database.onerror = function (event) {
        console.log("データベースに接続できませんでした");
    }

    //データベースを開いたらデータの登録を実行
    database.onsuccess = function (event) { //eventにはDBそのものが入っている
        let db = event.target.result; //接続成功したDBのデータ＝入出金データ
        //どのオブジェクトストアに対してトランザクション処理をするのか
        let transaction = db.transaction(storeName, "readwrite");
        //トランザクションの成功時
        transaction.oncomplete = function (event) {
            console.log("トランザクション完了");
        }
        //トランザクションの失敗時
        transaction.onerror = function (event) {
            console.log("トランザクションエラー");
        }

        let store = transaction.objectStore(storeName);
        let addData = store.add(data);
        addData.onsuccess = function () {
            console.log("データが登録できました");
            window.alert("登録しました");
        }
        addData.onerror = function () {
            console.log("データが登録できませんでした");
        }
        db.close();
    }
}



function createList () {
    //データベースからデータを全件取得
    let database = indexedDB.open(dbName);
    database.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction(storeName, "readonly");
        let store = transaction.objectStore(storeName);
        store.getAll().onsuccess = function (data) {
            console.log(data);
            let rows = data.target.result; //配列

            let section = document.getElementById("list");
            //入出金一覧のテーブルを作る
            //バッククオートでヒアドキュメント
            let table = `
                <table>
                    <tr>
                        <th>日付</th>
                        <th>収支</th>
                        <th>カテゴリ</th>
                        <th>金額</th>
                        <th>メモ</th>
                        <th>削除
                    </th>
                </tr>
            `;
            //入出金のデータを表示
            rows.forEach((element) => { //elementには１件分の連想配列データ
                console.log(element);
                table += `
                    <tr>
                        <td>${element.date}</td>
                        <td>${element.balance}</td>
                        <td>${element.category}</td>
                        <td>${element.amount}</td>
                        <td>${element.memo}</td>
                        <td><button>×</button></td>
                    </tr>
                `;
            });
            table += `</table>`;
            section.innerHTML = table;
        }
    }
}
