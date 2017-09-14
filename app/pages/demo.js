import React, {Component} from 'react';
import Carousel from './carousel';

const RED = '#FF4E4E';
const BLUE = '#286FDC';
const GREEN = '#3AC88E';

const DATA = [
    {
        name: '1',
        color: RED
    }, {
        name: '2',
        color: BLUE
    }, {
        name: '3',
        color: GREEN
    }
];

class Demo extends Component {
    renderItems = () => (_.map(DATA, item => (
        <div
            style={{
            background: item.color,
            height: '10em',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}
            key={item.color}>
            {item.name}
        </div>
    )))

    render() {
        return (
            <div className="component-content">
                <div className="component-section">
                    <div className="component-title" style={{'text-align':'center','margin-bottom':'20px','color':'#D05F4A'}}>轮播组件（PC端、移动端皆适用）</div>
                    <Carousel className="component-item" speed={500} pro={100} pagination={true}>
                        {this.renderItems()}
                    </Carousel>
                </div>
            </div>
        );
    }
}

export default Demo;