
import React from 'react';
import { PageLayout } from 'fw.core';

function App() {
  return (
    <PageLayout appBar={<div style={{ backgroundColor: "black", color: "white" }}>AppBar</div>}>
      <div>Content</div>
    </PageLayout>
  );
}

export default App;
