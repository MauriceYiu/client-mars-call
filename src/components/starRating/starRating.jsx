import React, { Component } from 'react';
import "./starRating.scss";

class StarRating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultWidth: 0,//默认显示星星的比例
            starCount: [0, 1, 2, 3, 4],
            nowRatingCount: -1,//当前评分
            isSetOk: false//评分是否设置好
        };
        this.setRating = this.setRating.bind(this);
    }
    render() {
        let { nowRating } = this.props;
        let { defaultWidth, starCount } = this.state;
        // console.log(this.state.nowRatingCount)
        return (
            <div className="star-rating">
                <div className="star">
                    <div className="default" ref={(defaultEle) => this.defaultEle = defaultEle}>
                        {
                            starCount.map((item, index) => {
                                return (
                                    <i className="iconfont icon-star_full" key={index}
                                        onMouseOver={(e) => this.setRating(e, "mouseOver", index, item)}
                                        onMouseOut={(e) => this.setRating(e, "mouseOut", index, item)}
                                        onClick={(e) => this.setRating(e, "click", index, item)}
                                    >
                                    </i>
                                )
                            })
                        }
                    </div>
                    <div className="now-rating" style={{ "width": nowRating ? nowRating : defaultWidth }}>
                        {
                            starCount.map((item, index) => {
                                return (<i className="iconfont icon-star_full" key={index}></i>)
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
    // 设置星星评分
    setRating(ele, type, index, item) {
        // 是否允许评分
        if (!this.props.canRating) {
            return;
        }

        let children = this.defaultEle.children;

        if (type === "mouseOver") {
            for (let i = 0; i <= index; i++) {
                children[i].style.color = 'rgb(238, 147, 29)';
            }
            this.setState({
                isSetOk: false
            });
        } else if (type === "mouseOut") {
            if (this.state.nowRatingCount !== -1) {
                for (let i = 0; i < this.state.nowRatingCount; i++) {
                    children[i].style.color = 'rgb(238, 147, 29)';
                }
                for (let i = this.state.nowRatingCount; i < this.state.starCount.length; i++) {
                    children[i].style.color = '#999';
                }
                return;
            }
            if (!this.state.isSetOk) {
                for (let i = 0; i <= index; i++) {
                    children[i].style.color = '#999';
                }
            }
        } else if (type === "click") {
            // console.log("设置好了");
            for (let i = 0; i <= index; i++) {
                children[i].style.color = 'rgb(238, 147, 29)';
            }
            let nowRatingCount = index + 1;
            this.setState({
                isSetOk: true,
                nowRatingCount
            });
            // 返回给父级当前分数
            this.props.getRating(nowRatingCount);
        }
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
}

export default StarRating;