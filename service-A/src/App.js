
import React from 'react';
import { PageLayout } from 'fw.core';

function App() {
  return (
    <PageLayout appBar={<div style={{ backgroundColor: "black", color: "white" }}>AppBar</div>}>
      <div>Service A</div>
      <p>Goto Service B <a>/serviceb</a></p>
    </PageLayout>
  );
}

export default App;
