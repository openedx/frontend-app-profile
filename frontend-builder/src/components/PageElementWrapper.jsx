import React from 'react';

// props provide same data to Layout as Page element will get
// including location, data, etc - you don't need to pass it
export default ({ element, props }) => (
  <div>
    <h1>hi</h1>
    {element}
  </div>
);
