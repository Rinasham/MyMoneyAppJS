//第3章：UIの動作
// 入力チェック機能のプログラムを記述

//ラジオボタンによりカテゴリを有効無効切り替え
//支出選択時カテゴリのセレクトBOXを無効にする（収入時は有効）
function disableSelectBox(disabled){
    document.getElementById("category").disabled = disabled; //右辺のdisabledはhtmlから渡される引数
}
//収支入力フォームの内容チェック
function inputCheck(){
    //チェック結果 true:入力チェックOK　false:未記入アリ
    let result = true;

    //選択した収支のラジオボタンの取得
    let radio = document.getElementsByName("balance"); //ラジオボタン２個を配列に入れる
    let balance;
    for(let i=0; i<radio.length; i++){　//ラジオ配列を順番にチェックボックスにチェックが入っているか確認。radio.length=２個のボタン
        if(radio[i].checked == true){　//チェックが入っていたらtrue,なければfalseで次のボタン
            balance = radio[i].value; //チェックが入ったボタンならその値(支出、収入)を変数に入れる
            break;
        }
    }
    //日付、カテゴリ、金額、メモの取得
    let date = document.getElementById("date").value;
    let category = document.getElementById("category").value;
    let amount = document.getElementById("amount").value;
    let memo = document.getElementById("memo").value;
    //入力チェック。未記入があればresultをfalseにする
    if(date == ""){
        result = false;
        alert("Input date!");
    } else if(category=="-選択してください-" && balance=="支出"){
        return false;
        alert("Choose from category!");
    } else if(amount=="" || amount==0){
        result = false;
        alert("Enter the amount of money.");
    } else if(memo==""){
        result =false;
        alert("Fill in the memo section.");
    }
    return result;
}

