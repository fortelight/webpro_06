const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win ) || 0;
  let total = Number( req.query.total ) || 0;

  console.log( {hand, win, total});

  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 今はダミーで人間の勝ちにしておく
  let judgement = '';
  if (hand == cpu) {
    judgement = '引き分け';
  } else if (
    (hand == 'グー' && cpu == 'チョキ') ||
    (hand == 'チョキ' && cpu == 'パー') ||
    (hand == 'パー' && cpu == 'グー') 
  ) {
    judgement = '勝ち';
    win += 1;
  } else {
    judgement = '負け';
  }

  total += 1;

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  };

  res.render('janken', display);
});

app.get("/saikoro", (req, res) => {
  const value = req.query.radio;
  const num = Math.floor( Math.random() * 11 + 1 );
  let dice = '';
  if( num<=5 ) dice = value;
  else if( num==6 ) dice = '1';
  else if( num==7 ) dice = '2';
  else if( num==8 ) dice = '3';
  else if( num==9 ) dice = '4';
  else if( num==10 ) dice = '5';
  else if( num==11 ) dice = '6';

  if (dice == value) judge ='成功'
  else judge = '失敗'

  console.log( {value, num, dice, judge});

    const display = {
      value : value, 
      dice : dice,
      judge : judge
    };
  res.render( 'saikoro', display );
});


app.get("/facegame", (req, res) => {
  let finger = req.query.radio;
  let win = Number( req.query.win ) || 0;
  let total = Number( req.query.total ) || 0;

  console.log( {finger, win, total});

  const num = Math.floor( Math.random() * 4 + 1 );
  let cpu = '';
  if( num==1 ) cpu = '上';
  else if( num==2 ) cpu = '下';
  else if ( num==3) cpu = '右';
  else cpu = '左';

  let judgement = '';
 if (
    (finger == cpu) 
  ) {
    judgement = '勝ち';
    win += 1;
  } else {
    judgement = '負け';
  }
  total += 1;

  const display = {
    your: finger,
    cpu: cpu,
    judgement: judgement,
   
  };

  res.render('facegame', display);
});
app.listen(8080, () => console.log("Example app listening on port 8080!"));