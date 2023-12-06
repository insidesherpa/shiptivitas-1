import React from "react";

function Navigation(props) {
  return (
    <ul className="nav nav-tabs" id="myTab" role="tablist">
      <li className="nav-item">
        <a
          className={
            "nav-link " + (props.selectedTab === "home" ? "active" : "")
          }
          onClick={() => props.onClick("home")}
          id="home-tab"
          data-toggle="tab"
          href="#home"
          role="tab"
          aria-controls="home"
          aria-selected={props.selectedTab === "home"}
        >
          Home
        </a>
      </li>
      <li className="nav-item">
        <a
          className={
            "nav-link " +
            (props.selectedTab === "shipping-requests" ? "active" : "")
          }
          onClick={() => props.onClick("shipping-requests")}
          id="shipping-requests-tab"
          data-toggle="tab"
          href="#shipping-requests"
          role="tab"
          aria-controls="shipping-requests"
          aria-selected={props.selectedTab === "shipping-requests"}
        >
          Shipping Requests
        </a>
      </li>
    </ul>
  );
}

export default Navigation;

// Changed the class component to functional component

// import React from 'react';

// export default class Navigation extends React.Component {
//   render() {
//     return (
//       <ul className="nav nav-tabs" id="myTab" role="tablist">
//         <li className="nav-item">
//           <a className={"nav-link " + (this.props.selectedTab === 'home' ? 'active': '')} onClick={() => this.props.onClick("home")}
//             id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected={this.props.selectedTab === 'home'}>Home</a>
//         </li>
//         <li className="nav-item">
//           <a className={"nav-link " + (this.props.selectedTab === 'shipping-requests' ? 'active': '')} onClick={() => this.props.onClick("shipping-requests")}
//           id="shipping-requests-tab" data-toggle="tab" href="#shipping-requests" role="tab" aria-controls="shipping-requests" aria-selected={this.props.selectedTab === 'shipping-requests'}>Shipping Requests</a>
//         </li>
//       </ul>
//     );
//   }
// }