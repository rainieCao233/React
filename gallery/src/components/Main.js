require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// let yeomanImage = require('../images/yeoman.png');

// 获取图片相关的数据
let imageData = require('../data/imageData.json');

// 使用自执行函数，将图片名信息转成图片URL路径信息
imageData = (function genImageURL(imageData){
	for (var i = imageData.length - 1; i >= 0; i--) {
		var singleImageData = imageData[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageData[i] = singleImageData;
	}
	return imageData;
})(imageData);

var ImgFigure = React.createClass({
	/*
	 * imgFigure的点击处理函数
	 */
	handleClick:function(e){
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	},
	render:function(){
		var styleObj = {};
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}
		//rotate
		if(this.props.arrange.rotate){
			(['MozT', 'MsT', 'WebkitT', 't']).forEach(function(v){
				styleObj[v + 'ransform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
		}

		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11;
		}

		//isInverse
		var imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse?' is-inverse':'';

		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title} width="240px" height="240px"/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick} >
						<p>{this.props.data.description}</p>
					</div>
				</figcaption>
			</figure>
		)
	}
});

function getRangeRandom(low, high){
	return Math.floor(Math.random()*(high - low) + low);
}

/*
 * 获取0-30之间的任意正负值
 */
function get30DegRandow(){
	return (Math.random() > 0.5 ? '':'-') + Math.ceil(Math.random() * 30);
}

var AppComponent = React.createClass ({
	getInitialState:function(){
		return {
			imgsArrangeArr:[]
		}
	},
	Constant:{
		centerPos:{
			left:0,
			right:0
		},
		hPosRange:{
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{
			topY:[0,0],
			x:[0,0]
		}
	},
	componentDidMount:function(){
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
				stageW = stageDOM.scrollWidth,
				stageH = stageDOM.scrollHeight,
				halfStageW = Math.ceil(stageW / 2),
				halfStageH = Math.ceil(stageH / 2);

		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
				imgW = imgFigureDOM.scrollWidth,
				imgH = imgFigureDOM.scrollHeight,
				halfImgW = Math.ceil(imgW / 2),
				halfImgH = Math.ceil(imgH / 2);

		this.Constant.centerPos = {
			left:halfStageW - halfImgW,
			top:halfStageH - halfImgH
		}

		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(4);
	},
	/*
	 * 重新布局所有图片
	 * @param centerIndex 制定排布哪个图片
	 */
	rearrange:function(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
				Constant = this.Constant,
				centerPos = Constant.centerPos,
				hPosRange = Constant.hPosRange,
				vPosRange = Constant.vPosRange,
				hPosRangeLeftSecX = hPosRange.leftSecX,
				hPosRangeRightSecX = hPosRange.rightSecX,
				hPosRangeY = hPosRange.y,
				vPosRangeTopY = vPosRange.topY,
				vPosRangeX = vPosRange.x,

				imgsArrangeTopArr = [],
				topImgNum = Math.floor(Math.random() * 2),
				topImgSpliceIndex = 0,
				
				//布局居中位置元素
				imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
				imgsArrangeCenterArr[0] = {
					pos:centerPos,
					rotate:0,
					isCenter:true
				};

				//布局上侧
				topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
				imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

				imgsArrangeTopArr.forEach(function(v,index){
					imgsArrangeTopArr[index] = {
						pos:{
							top:getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
							left:getRangeRandom(vPosRangeX[0], vPosRangeX[1])
						},
						rotate:get30DegRandow(),
						isCenter:false
					};
				});

				//布局两侧
				for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
					var hPosRangeLORX = null;
					
					//前半部分布局左边，后半部分布局右边
					if(i < k){
						hPosRangeLORX = hPosRangeLeftSecX;
					}else{
						hPosRangeLORX = hPosRangeRightSecX
					}

					imgsArrangeArr[i] = {
						pos:{
							top:getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
							left:getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
						},
						rotate:get30DegRandow(),
						isCenter:false
					}
				}

				if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
					imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
				}

				imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

				this.setState({
					imgsArrangeArr:imgsArrangeArr
				});
	},
	/*
	 * 利用 rearrange 函数，居中对应index图片
	 * @param index，需要被居中的图片对应的图片信息数组的index
	 * @return {function}
	 */
	center:function(index){
		return function(){
			this.rearrange(index);
		}.bind(this);
	},
	/*
	 * 翻转图片
	 * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
	 * @return {Function} 这是一个闭包函数，其内return一个真正代被执行的函数
	 */
	inverse:function(index){
		return function(){
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr:imgsArrangeArr
			});


		}.bind(this);
	},
  render:function() {
  	var controllerUnits = [], imgFigures = [];

  	imageData.forEach(function(v,index){
  		if(!this.state.imgsArrangeArr[index]){
  			this.state.imgsArrangeArr[index] = {
  				pos:{
  					left:0,
  					top:0
  				},
  				rotate: 0,
  				isInverse:false,
  				isCenter:false
  			}
  		}
  		imgFigures.push(<ImgFigure key={index} data={v} ref={'imgFigure' + index} center={this.center(index)} inverse={this.inverse(index)} arrange={this.state.imgsArrangeArr[index]}/>);
  	}.bind(this));

    return (
      <div className="stage" ref="stage">
      	<section className="img-sec">
      		{imgFigures}
      	</section>
      	<nav className="controller-nav">
      		{controllerUnits}
      	</nav>
      </div>
    );
  }
});

export default AppComponent;