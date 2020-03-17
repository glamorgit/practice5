//准备
var backCards;
ready();
function ready(){ //摞牌效果
	var out=document.getElementById('cardsBox');
	for(var i=0;i<10;i++){
		var div=document.createElement('div');
		div.style.top=-i-2+'px';
		div.style.left=i+'px';
		out.appendChild(div);
	}
	backCards=out.getElementsByTagName('div');
}
//创建元素,开始游戏
function start(a){
	var deck=(new Deck()).shuffle(); //创建一副新扑克牌并洗牌
	a.setAttribute('onclick','');
	a.style.backgroundColor='#bbb';
	document.getElementById('mask').style.display='block';
	restart();
	ready();
	var allCards=deck.cards; //所有的牌
	var len=allCards.length, url, num, parent, long, top, m=1, n=1;
	for(var i=0;i<len;i++){
		(function(i){
			setTimeout(function(){
				if(backCards[10-Math.floor(i/5)]) backCards[0].parentNode.removeChild(backCards[10-Math.floor(i/5)]);
				if(allCards[i].toStringSuit()==1) url='img/clubs.jpg'; //花色图片
				if(allCards[i].toStringSuit()==2) url='img/diamonds.jpg';
				if(allCards[i].toStringSuit()==3) url='img/hearts.jpg';
				if(allCards[i].toStringSuit()==4) url='img/spades.jpg';
				num=allCards[i].toStringRank(); //点数值
				if(num>10) num=allCards[i].toStringRankStr().substr(0,1);
				var imgSmall=document.createElement('div');
				var imgBig=document.createElement('div');
				imgSmall.setAttribute('class','img-small');
				imgBig.setAttribute('class','img-big');
				imgSmall.style.backgroundImage='url('+url+')';
				imgBig.style.backgroundImage='url('+url+')';
				var pSmall=document.createElement('p');
				var pBig=document.createElement('p');
				pSmall.setAttribute('class','p-small');
				pBig.setAttribute('class','p-big');
				if(allCards[i].toStringSuit()==2 || allCards[i].toStringSuit()==3) pSmall.style.color='red';
				var textSmall=document.createTextNode(num);
				var textBig=document.createTextNode(num);
				pSmall.appendChild(textSmall);
				pBig.appendChild(textBig);
				var back=document.createElement('div');
				back.setAttribute('class','back');
				var card=document.createElement('div'); //卡牌元素
				card.appendChild(imgSmall);
				card.appendChild(pSmall);
				card.appendChild(imgBig);
				card.appendChild(pBig);
				card.appendChild(back);
				card.setAttribute('class','card');
				card.suit=allCards[i].toStringSuit(); //花色
				card.rank=allCards[i].toStringRank(); //点数
				if(card.rank==14) card.rank=1;
				card.face=allCards[i].face; //正反
				if(card.face==0) card.lastChild.style.display='block'; //反面
				else card.lastChild.style.display='none';
				if(i<24){ //摆牌(排列)
					parent=document.getElementById('col'+i%8);
					long=parent.getElementsByClassName('card').length;
					if(long==0) top=0;
					else top=parseInt(parent.lastChild.style.top)+25;
					document.getElementById('col'+i%8).appendChild(card);
					card.style.top=top+'px';
				}else{
					parent=document.getElementById('col'+m);
					long=parent.getElementsByClassName('card').length;
					if(long==0) top=0;
					else top=parseInt(parent.lastChild.style.top)+25;
					document.getElementById('col'+m).appendChild(card);
					card.style.top=top+'px';
					m++;
					if(m==8){
						n++; m=n;
					}
				}
			}, i*50);
		})(i)
	}
	setTimeout(function(){
		a.setAttribute('onclick','start(this)');
		a.style.backgroundColor='#5a6';
		a.innerHTML='重新开始';
		document.getElementById('mask').style.display='none';
	},3000);
}
//清空桌面,重新开始
function restart(){
	var cards=document.getElementsByClassName('card');
	while(cards[0]){ //循环删除第一个,直到没有
		cards[0].parentNode.removeChild(cards[0]);
	}
}
//获取鼠标位置
var x, y;
document.getElementById('left').onmousemove=function(e){
	x=(e.pageX || e.clientX)-this.offsetLeft-this.parentNode.parentNode.offsetLeft;
	y=(e.pageY || e.clientY);
	dragObj.style.cssText='left:'+(x-45)+'px;top:'+y+'px;';
}
//拖放
//拖
var oldColId, newColId, oldCol, newCol;
var deskObj=document.getElementById('left');
var dragObj=document.createElement('div');
deskObj.appendChild(dragObj);
dragObj.setAttribute('class','drag');
deskObj.addEventListener('mousedown',function(event){
	var target, all, len;
	if(event.target.id=='left' || event.target.nodeName=='LI') return;
	if(event.target.parentNode.face==0) return;
	if(event.target.classList.contains('card')) target=event.target;
	else target=event.target.parentNode;
	all=target.parentNode.childNodes;
	len=all.length;
	oldColId=target.parentNode.id; //被拖拽的列
	for(var i=0;i<len;i++){
		if(all[i]==target){ //从目标牌开始
			for(var j=i;j<len;j++){
				dragObj.appendChild(all[i]); //循环添加第i个牌到拖拽元素中
				dragObj.lastChild.style.top=(j-i)*25+'px';
			}
			break;
		}
	}
	deskObj.style.cursor='none';
});
//移
deskObj.addEventListener('mouseover',function(event){
	var target;
	if(event.target.id=='left') return;
	if(event.target.nodeName=='LI') target=event.target;
	else if(event.target.classList.contains('card')) target=event.target.parentNode;
	else target=event.target.parentNode.parentNode;
	newColId=target.id; //被放置的列
})
//放
window.addEventListener('mouseup',function(event){
	if(dragObj.firstChild){
		var all=dragObj.childNodes;
		var len=all.length;
		newCol=document.getElementById(newColId); //被放置的列
		oldCol=document.getElementById(oldColId); //被拖拽的列
		if(newColId!=oldColId && newCol.lastChild && newCol.lastChild.suit==dragObj.firstChild.suit && newCol.lastChild.rank==dragObj.firstChild.rank+1){ //可以放牌时
			for(var i=0;i<len;i++){
				newCol.appendChild(all[0]);
			}
			cardSpace();
		}else if(!newCol.lastChild & dragObj.firstChild.rank==13){ //放K牌时
			for(var j=0;j<len;j++){
				newCol.appendChild(all[0]);
			}
			cardSpace();
		}else{ //不能放牌时
			for(var k=0;k<len;k++){
				oldCol.appendChild(all[0]);
			}
			var oldAll=oldCol.getElementsByClassName('card');
			for(var n=0;n<oldAll.length;n++){
				oldAll[n].style.top=n*25+'px';
			}
			while(parseInt(oldCol.lastChild.style.top)>430){ //被放置的列超长时调整间距
				for(var m=0;m<oldAll.length;m++){
					oldAll[m].style.top=(parseInt(oldAll[m].style.top)-m*4)+'px';
				}
			}
		}
		deskObj.style.cursor='pointer';
		check();
	}
});
//翻牌
deskObj.addEventListener('click',function(event){
	if(event.target.classList.contains('back')) target=event.target;
	else return;
	if(!target.parentNode.nextSibling){
		target.style.display='none';
		target.parentNode.face=1;
		check();
	}
})
//牌间距
function cardSpace(){
	var newAll=newCol.getElementsByClassName('card');
	for(var i=0;i<newAll.length;i++){
		newAll[i].style.top=i*25+'px';
	}
	while(parseInt(newCol.lastChild.style.top)>430){ //被放置的列超长时调整间距
		for(var j=0;j<newAll.length;j++){
			newAll[j].style.top=(parseInt(newAll[j].style.top)-j*4)+'px';
		}
	}
	var oldAll=oldCol.getElementsByClassName('card'); //被拖拽的列缩短时调整间距
	if(oldAll.length>1 && oldAll.length<19){
		for(var k=0;k<oldAll.length;k++){
			oldAll[k].style.top=k*25+'px';
		}
	}
	if(oldAll.length>18 && oldAll.length<22){
		for(var k=0;k<oldAll.length;k++){
			oldAll[k].style.top=k*21+'px';
		}
	}
	if(oldAll.length>21 && oldAll.length<27){
		for(var k=0;k<oldAll.length;k++){
			oldAll[k].style.top=k*17+'px';
		}
	}
}
//判断完成或失败
function check(){
	var allCols=document.getElementsByClassName('col');
	var allCards=document.getElementsByClassName('card');
	for(var i=0;i<allCols.length;i++){ //判断是否还能移动牌
		if(allCols[i].lastChild){ //判断有牌的列
			var last=allCols[i].lastChild; //判断目标
			if(last.face==0) return;
			var otherFaceCards=[]; //目标牌所在列之外的其他列的正面的牌
			for(var j=0;j<allCols.length;j++){
				if(j!=i){
					var oneColCards=allCols[j].getElementsByClassName('card');
					for(var k=0;k<oneColCards.length;k++){
						if(oneColCards[k].face!=0) otherFaceCards.push(oneColCards[k]);
					}
				}
			}
			for(var h=0;h<otherFaceCards.length;h++){
				if(otherFaceCards[h].suit==last.suit && otherFaceCards[h].rank==last.rank-1) return;
			}
		}else{ //如果有没牌的列,判断是否能放K牌
			for(var m=0;m<allCards.length;m++){
				if(allCards[m].face!=0 && allCards[m].rank==13 && allCards[m].previousSibling) return;
			}
		}
	}
	for(var x=0;x<allCols.length;x++){ //当不能移动时,判断是否完成了游戏
		if(!allCols[x].firstChild) continue;
		if(allCols[x].firstChild.rank!=13 || allCols[x].lastChild.rank!=1 || allCols[x].firstChild.suit!=allCols[x].lastChild.suit){
			alert('没有可以移动的牌了!请重新开始!');
			return;
		}
		var theColCards=allCols[x].getElementsByClassName('card');
		if(theColCards.length!=13){
			alert('没有可以移动的牌了!请重新开始!');
			return;
		}
		var firstCard=theColCards[0];
		for(var y=1;y<theColCards.length;y++){
			if(theColCards[y].suit!=firstCard.suit || theColCards[y].rank!=theColCards[y-1].rank-1){
				alert('没有可以移动的牌了!请重新开始!');
				return;
			}
		}
	}
	alert('你真棒!完成了游戏!');
}
