import React from "react";
import "./Card.css";

function Card(props) {
  const getStatusClassName = (status) => {
    switch (status) {
      case "backlog":
        return "Card-grey";
      case "in-progress":
        return "Card-blue";
      case "complete":
        return "Card-green";
      default:
        return "";
    }
  };

  return (
    <div
      className={`Card ${getStatusClassName(props.status)}`}
      data-id={props.id}
      data-status={props.status}
    >
      <div className="Card-title">{props.name}</div>
    </div>
  );
}

export default Card;


// I have tried this tooo with class components

// class Card extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       className: ''
//     };
//   }
  
// componentDidMount(){
    
//   this.setState({ className: this.getColorClass(this.props.status) });
// }


// componentDidUpdate(prevProps) {


//   if (this.props.status !== prevProps.status) {
//     const newClassName = this.getColorClass(this.props.status);
//     console.log('Previous Status:', prevProps.status);
//     console.log('New Status:', this.props.status);
//     console.log('New Class:', newClassName);

//     this.setState({ className: newClassName });
//   }
// }



// getColorClass(status) {
//   let className = ['Card'];
//   if (status === 'backlog') {
//     className.push('Card-grey');
//   } else if (status === 'in-progress') {
//     className.push('Card-blue');
//   } else if (status === 'complete') {
//     className.push('Card-green');
//   }
//   return className.join(' ');
// }