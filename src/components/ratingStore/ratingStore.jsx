import React, { Component } from 'react';
import "./ratingStore.scss";
// import StarRating from "./../starRating/starRating";
import { Radio } from 'antd';

const RadioGroup = Radio.Group;

// 评价网吧弹窗

class RatingStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ratingItems: [
                { name: "网吧服务", grade: "VERY_GOOD", englishName: "netService" },
                { name: "网速流畅", grade: "VERY_GOOD", englishName: "netFluency" },
                { name: "卫生情况", grade: "VERY_GOOD", englishName: "healthConditions" },
                { name: "空气质量", grade: "VERY_GOOD", englishName: "airQuality" },
                { name: "桌椅舒适度", grade: "VERY_GOOD", englishName: "comfort" },
                { name: "键盘、鼠标、耳机", grade: "VERY_GOOD", englishName: "equipment" }
            ],
            textVal:"",
        };
        this.getRating = this.getRating.bind(this);
    }
    render() {
        const { ratingItems } = this.state;
        // console.log(ratingItems);
        return (
            <div className="rating-store" onClick={() => this.props.hide()}>
                <div className="rating-box" onClick={(e) => e.stopPropagation()}>
                    <div className="rating-store-head">
                        <span>网吧点评</span>
                    </div>
                    <p className="store-other-info">您的满意是我们不懈的追求</p>
                    <div className="rating-items">
                        <ul>
                            {
                                ratingItems.map((item, index) => {
                                    return (
                                        <li className="item" key={index}>
                                            <span className="item-name">{item.name}</span>
                                            <span className="rating">
                                                <RadioGroup size="large" onChange={(e) => this.onChange(e)} name={"" + index} value={ratingItems[index].grade}>
                                                    <Radio value={"VERY_GOOD"}><i className="rating-item-text">非常满意</i></Radio>
                                                    <Radio value={"GOOD"}><i className="rating-item-text">满意</i></Radio>
                                                    <Radio value={"BAD"}><i className="rating-item-text">不满意</i></Radio>
                                                </RadioGroup>
                                            </span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className="rating-text">
                        <textarea name="rating-text" 
                        value={this.state.textVal} 
                        onChange={(e)=>this.setState({
                            textVal:e.target.value
                        })}
                        placeholder="可选填..." id="rating-text"></textarea>
                    </div>
                    <div className="rating-button">
                        <button onClick={() => this.props.hide()}>返回</button>
                        <button className="confirm-rating" onClick={() => this.props.confirm(ratingItems,this.state.textVal)}>提交点评</button>
                    </div>
                </div>
            </div>
        );
    }
    // 改变当前项的评论
    onChange(e) {
        console.log(e);
        console.log('radio checked', e.target.name);
        console.log('radio checked', e.target.value);
        
        let { ratingItems } = this.state;
        let nowModItem = ratingItems[e.target.name];

        ratingItems.splice(e.target.name, 1, {
            name: nowModItem.name,
            grade: e.target.value,
            englishName: nowModItem.englishName
        })
        this.setState({
            ratingItems
        });
    }
    getRating(grade, item, index) {
        let { ratingItems } = this.state;
        ratingItems[index].grade = grade;
        this.setState({
            ratingItems
        });
    }
    componentDidUpdate(){
        console.log(this.state.ratingItems)
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
}

export default RatingStore;