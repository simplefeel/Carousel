import React, {Component} from 'react'
import styled from 'styled-components'
import {getPosition,get,size,omit,head,last,isEmpty} from '../utils/domUtils'
import tweenFunctions from 'tween-functions';
import PropTypes from 'prop-types';
import requestAnimationFrame from 'raf';

const FPS = 60;
const UPDATE_INTERVAL = 1000 / FPS;
const THRESHOLD_PERCENTAGE = 0.1;
const MISOPERATION_TIME_PERCENTAGE = THRESHOLD_PERCENTAGE * 2;
const START_INDEX = 1;

const Container = styled.div `
    position: relative;
    display: block;
    width: 100%;
    height: auto;
    box-sizing: border-box;
    color: #fff
`;

const Frame = styled.div `
    position: relative;
    display: block;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
    width: ${props => props.width}px;
`;

const SliderList = styled.div `
    display: block;
    width: ${props => `${props.width}px`};
    transform: translateX(${props => `${props.translateX}px`});
    width: ${props => props.width * props.count}px;
`;

const SliderItem = styled.div `
    float: left;
    display: block;
    height: auto;
    width: ${props => props.width}px;
`;
const Prev = styled.div`
    position: absolute;
    display: block;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 30px;
    color: #fff;
`;
const Next = styled.div`
    position: absolute;
    display: block;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 30px;
    color: #fff;
`;

const propTypes = {
    children: PropTypes
        .arrayOf(PropTypes.element,)
        .isRequired,
    speed: PropTypes.number
};

const defaultProps = {
    speed: 500
};

class Carousel extends Component {

    state = {
        width: 0,
        currentIndex: START_INDEX,
        translateX: 0,
        startPositionX: 0,
        moveDeltaX: 0,
        dragging: false,
        direction: null
    };

    componentDidMount() {
        this.getContainerWidth();
        this.forbiddenBodyTouch();
    }

    componentWillUnmount() {
        requestAnimationFrame.cancel(this.rafId);
    }

    forbiddenBodyTouch = ()=>{
        document.addEventListener('touchmove',(e)=>{
            e.preventDefault();
        })
    }

    getContainerWidth = () => {
        const width = get(this.container.getBoundingClientRect(), 'width');
        this.setState({
            width,
            translateX: -(width) * START_INDEX
        });
    }

    getTweenQueue = (beginValue, endValue, speed) => {
        const tweenQueue = [];
        const updateTimes = speed / UPDATE_INTERVAL;
        for (let i = 0; i < updateTimes; i += 1) {
            tweenQueue.push(tweenFunctions.easeInOutQuad(UPDATE_INTERVAL * i, beginValue, endValue, speed),);
        }
        return tweenQueue;
    }

    handleNext = (e) => {
        const {children, speed} = this.props;
        const {width, currentIndex, translateX} = this.state;
        const count = size(children);

        let newIndex;
        let endValue;
       
        newIndex = currentIndex !== count
            ? currentIndex + 1
            : START_INDEX;
        endValue = -(width) * (currentIndex + 1);

        const tweenQueue = this.getTweenQueue(translateX, endValue, speed);
        this.rafId = requestAnimationFrame(() => this.animation(tweenQueue, newIndex));
    }

    handlePrev = (e) => {
        const {children, speed} = this.props;
        const {width, currentIndex, translateX} = this.state;
        const count = size(children);

        let newIndex;
        let endValue;
       
        newIndex = currentIndex !== START_INDEX
            ? currentIndex - 1
            : count;
        endValue = -(width) * (currentIndex - 1);

        const tweenQueue = this.getTweenQueue(translateX, endValue, speed);
        this.rafId = requestAnimationFrame(() => this.animation(tweenQueue, newIndex));
    }

    handleTouchStart = (e) => {
        const {x} = getPosition(e);
        this.setState({startPositionX: x})
    }

    handleTouchMove = (e) => {
        const {width, currentIndex, startPositionX} = this.state;
        const {x} = getPosition(e);
        const deltaX = x - startPositionX;
        const direction = deltaX > 0
            ? 'right'
            : 'left';
        this.setState({
            moveDeltaX: deltaX,
            direction,
            translateX: -(width * currentIndex) + deltaX
        })
    }

    handleTouchEnd = () => {
        const {moveDeltaX, width} = this.state;
        const threshold = width * THRESHOLD_PERCENTAGE;
        const moveToNext = Math.abs(moveDeltaX) > threshold;

        this.setState({dragging: false});

        if (moveToNext) {
            this.handleSwipe()
        } else {
            this.handleMisoperation();
        }
    }

    handleSwipe = () => {
        const {children, speed} = this.props;
        const {width, currentIndex, direction, translateX} = this.state;
        const count = size(children);

        let newIndex;
        let endValue;
        if (direction === 'left') {
            newIndex = currentIndex !== count
                ? currentIndex + 1
                : START_INDEX;
            endValue = -(width) * (currentIndex + 1);
        } else {
            newIndex = currentIndex !== START_INDEX
                ? currentIndex - 1
                : count;
            endValue = -(width) * (currentIndex - 1);
        }

        const tweenQueue = this.getTweenQueue(translateX, endValue, speed);
        this.rafId = requestAnimationFrame(() => this.animation(tweenQueue, newIndex));
    }

    animation = (tweenQueue, newIndex) => {
        if (isEmpty(tweenQueue)) {
            this.handleOperationEnd(newIndex);
            return;
        }

        this.setState({
            translateX: head(tweenQueue)
        });
        tweenQueue.shift();
        this.rafId = requestAnimationFrame(() => this.animation(tweenQueue, newIndex));
    }

    handleMisoperation = () => {
        const {speed} = this.props;
        const {width, currentIndex, translateX} = this.state;

        const endValue = -(width) * currentIndex;
        const tweenQueue = this.getTweenQueue(translateX, endValue, speed * MISOPERATION_TIME_PERCENTAGE,);
        this.rafId = requestAnimationFrame(() => this.animation(tweenQueue, currentIndex));
    }

    handleOperationEnd = (newIndex) => {
        const {width} = this.state;

        this.setState({
            currentIndex: newIndex,
            translateX: -(width) * newIndex,
            startPositionX: 0,
            moveDeltaX: 0,
            dragging: false,
            direction: null
        });
    }
    handleMouseDown = (e) => {
        this.setState({dragging: true});
        this.handleTouchStart(e);
    }

    handleMouseMove = (e) => {
        if (!this.state.dragging) {
            return;
        }
        this.handleTouchMove(e);
    }

    handleMouseUp = () => {
        if (!this.state.dragging) {
            return;
        }
        this.handleTouchEnd();
    }

    handleMouseLeave = () => {
        if (!this.state.dragging) {
            return;
        }
        this.handleTouchEnd();
    }

    renderSlideList = () => {
        const {children} = this.props;
        const {translateX, width} = this.state;
        const count = _.size(children) + 2;
        const firstElement = head(children);
        const lastElement = last(children);
        return (
            <Frame width={width}>
                <SliderList width={width} count={count} translateX={translateX}>
                    <SliderItem width={width}>
                        {lastElement}
                    </SliderItem>
                    {_.map(children, (c, i) => (
                        <SliderItem
                            key={i}
                            width={width}
                            onTouchStart={this.handleTouchStart}
                            onTouchMove={this.handleTouchMove}
                            onTouchEnd={this.handleTouchEnd}
                            onMouseDown={this.handleMouseDown}
                            onMouseMove={this.handleMouseMove}
                            onMouseUp={this.handleMouseUp}
                            onMouseLeave={this.handleMouseLeave}>
                            {c}
                        </SliderItem>
                    ))}
                    <SliderItem width={width}>
                        {firstElement}
                    </SliderItem>
                </SliderList>
            </Frame>
        )
    }
    renderPagination = ()=>{
        const {pagination} = this.props;
        return (
            <div>
                <Next onClick={this.handleNext}>&gt;</Next>
                <Prev onClick={this.handlePrev}>&lt;</Prev>
            </div>
        )
    }
    render() {
        const rest = omit(this.props, ['children', 'speed']);
        return (
            <Container
                {...rest}
                innerRef={(node) => {
                this.container = node;
            }}>
                {this.renderSlideList()}
                {this.renderPagination()}
            </Container>
        )
    }
}

Carousel.propTypes = propTypes;
Carousel.defaultProps = defaultProps;
export default Carousel;