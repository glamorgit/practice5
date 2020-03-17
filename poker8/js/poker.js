//创建一个新的枚举类型,实参对象表示类的每个实例的名字和值,返回一个构造函数
function enumeration(namesToValues){
	var enumeration=function(){throw "Can't Instantiate Enumerations";};
	var proto=enumeration.prototype={
		constructor:enumeration, //标识类型
		toString:function(){return this.name;}, //返回名字
		valueOf:function(){return this.value;}, //返回值
		toJSON:function(){return this.name;} //转换为JSON
	};
	enumeration.values=[]; //存放枚举对象的数组
	for(name in namesToValues){ //创建新类型的实例
		var e=Object.create(proto); //创建一个代表它的对象
		e.name=name;
		e.value=namesToValues[name];
		enumeration[name]=e; //将它设置为构造函数的属性
		enumeration.values.push(e);
	}
	enumeration.foreach=function(f,c){
		for(var i=0;i<this.values.length;i++) f.call(c,this.values[i]);
	};
	return enumeration; //返回标识这个新类型的构造函数
}

//使用枚举类型表示一张扑克牌
//定义一个表示扑克牌的类
function Card(suit,rank){
	this.suit=suit; //花色
	this.rank=rank; //点数
	this.face=0; //正反
}
//使用枚举类型定义花色和点数
Card.Suit=enumeration({Clubs:1,Diamonds:2,Hearts:3,Spades:4});
Card.Rank=enumeration({Two:2,Three:3,Four:4,Five:5,Six:6,Seven:7,Eight:8,Nine:9,Ten:10,Jack:11,Queen:12,King:13,Ace:14});
//定义用以描述牌面的文本
Card.prototype.toString=function(){return this.suit.toString()+"-"+this.rank.toString();};
Card.prototype.toStringSuit=function(){return this.suit.valueOf();};
Card.prototype.toStringRank=function(){return this.rank.valueOf();};
Card.prototype.toStringRankStr=function(){return this.rank.toString();};
//比较两张牌的大小
Card.prototype.compareTo=function(that){
	if(this.rank<that.rank) return -1;
	if(this.rank>that.rank) return 1;
	return 0;
};
//以扑克牌的规则进行排序
Card.orderByRank=function(a,b){return a.compareTo(b);};
//以桥牌的规则进行排序
Card.orderBySuit=function(a,b){
	if(a.suit<b.suit) return -1;
	if(a.suit>b.suit) return 1;
	if(a.rank<b.rank) return -1;
	if(a.rank>b.rank) return 1;
	return 0;
};

//定义表示一副扑克牌的类
function Deck(){
	var cards=this.cards=[]; //一副牌的数组
	Card.Suit.foreach(function(s){
		Card.Rank.foreach(function(r){
			cards.push(new Card(s,r));
		});
	});
}
//洗牌:返回洗好的牌
Deck.prototype.shuffle=function(){
	var deck=this.cards, len=deck.length;
	for(var i=len-1;i>0;i--){ //遍历数组,随机找出索引比它小的元素,并与之交换
		var r=Math.floor(Math.random()*(i+1)), temp;
		temp=deck[i], deck[i]=deck[r],deck[r]=temp;
		if(i<16) deck[i].face=0; //前16张牌朝下
		else deck[i].face=1;
	}
	return this;
};
//发牌:返回发牌的数组
Deck.prototype.deal=function(){
	//return this.cards.splice(this.cards.length-n,n);
};

//创建一副新扑克牌,洗牌,发牌,排序
//var deck=(new Deck()).shuffle();
//var hand=deck.deal(13).sort(Card.orderBySuit());
