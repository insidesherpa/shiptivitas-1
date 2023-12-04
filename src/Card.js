import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: ''
    };
  }
  
  componentDidMount(){
    
    this.setState({ className: this.getColorClass(this.props.status) });
  }


  componentDidUpdate(prevProps) {


    if (this.props.status !== prevProps.status) {
      const newClassName = this.getColorClass(this.props.status);
      console.log('Previous Status:', prevProps.status);
      console.log('New Status:', this.props.status);
      console.log('New Class:', newClassName);

      this.setState({ className: newClassName });
    }
  }
  
  

  getColorClass(status) {
    let className = ['Card'];
    if (status === 'backlog') {
      className.push('Card-grey');
    } else if (status === 'in-progress') {
      className.push('Card-blue');
    } else if (status === 'complete') {
      className.push('Card-green');
    }
    return className.join(' ');
  }

  
  render() {
    return (
      <div className={this.state.className} data-id={this.props.id} data-status={this.props.status}>
  <div className="Card-title">{this.props.name}</div>
</div>

    );
  }
}

export default Card;