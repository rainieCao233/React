require('styles/App.scss');

import React from 'react';

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

class AppComponent extends React.Component {
  render() {
    return (
      <div className="stage">
      	<section className="img-sec"></section>
      	<nav className="controller-nav"></nav>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;