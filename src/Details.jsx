import React from 'react';
import Card from './components/Card';
import TableComponent from './components/TableComponent';



const Details = () => {
  return (
    <Card height="auto">
      <TableComponent />
    </Card>
  );
};

export default React.memo(Details);
