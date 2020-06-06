import React from "react";
import ListView from "../listView/ListView";
import GraphView from "../graphView/GraphView";

function Container() {
  return (
    <div className="container">
      <ListView />
      <GraphView />
    </div>
  );
}

export default Container;
