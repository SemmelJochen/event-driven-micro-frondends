
import React from 'react';
import { PageLayout } from 'fw.core';

function App() {
  return (
    <PageLayout appBar={<div style={{ backgroundColor: "black", color: "white" }}>AppBar</div>}>
      <div>Service B</div>
      <p>Goto Service A <a>/servicea</a></p>
    </PageLayout>
  );
}

export default App;
