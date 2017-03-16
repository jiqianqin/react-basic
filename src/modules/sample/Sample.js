import React, {Component} from 'react';
import { Button,Icon } from 'antd-mobile';
import './style.scss';

export default class Sample extends Component {
  render() {
    return (
      <div>
        <Icon type="link" className='sampleIcon'/>
        例子
      </div>
    )
  }
}
