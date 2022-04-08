import { PageLayout } from 'fw.core';
import React from 'react';
import './App.css';

function App() {
  return (
    <PageLayout appBar={<div>AppBar</div>}>
      <div>Content</div>
    </PageLayout>
  );
}

export default App;
