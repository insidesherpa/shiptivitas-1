Before Drag and Drop
![Screenshot 2023-12-21 133851](https://github.com/leonkoech/Portfolio6871/assets/39020723/6109c96f-29e6-4406-bbef-ebcdb6071d3b)

After Drag and Drop
![Screenshot 2023-12-21 133919](https://github.com/leonkoech/Portfolio6871/assets/39020723/12d81715-55f3-4229-8293-ce020a36b78a)

Code with comments

```
// check if component mounted
  componentDidMount() {
    // initialize function for drag and drop
    this.initializeDragula();
  }

  /**
   * feature function for dragging and dropping and updating the details
   */
  initializeDragula() {
    // map the container references to an array
    const containers = Object.values(this.swimlanes).map((ref) => ref.current);
   
    /**
     * Function to change color and status of the card after dragging and dropping
     * @param { Element } cardElement 
     * @param { Element } targetContainer 
     */
    const changeCardAttributes = (cardElement, targetContainer) => {
      // find the index of the target container
      const containerIndex = containers.indexOf(targetContainer)

      // use index as a mapper for class based on swimlane
      const colorMapper = [ "Card-grey", "Card-blue", "Card-green" ]
      const statusMapper = [ "backlog", "in-progress", "complete" ]

      // change the classsName of current card in order to change the color based on swimlane position
      cardElement.className = `Card ${colorMapper[containerIndex]} gu-transit`;
      // change the data-status based on swimlane
      cardElement.setAttribute("data-status",statusMapper[containerIndex] );
    }
  
    // initialize the drag and drop  package function
    Dragula(containers)
    // utilize the drop feature as it provides the target container
      .on('drop', function (el, targetContainer) {
        // call the change card attribute function 
        changeCardAttributes(el, targetContainer);
      })
  }
```
Note: I chose to use index as the color mapper as commented above
