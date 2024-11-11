import React from 'react';
import Card from './components/Card';
import HomeCard from './components/HomeCard';

function Home() {
  const cardsData = [
    { title: 'Area', startDate: '1,920 Acres', bgColor: '#6B8E23' },
    { title: 'Regions', startDate: '08', bgColor: '#6B8E23' },
    { title: 'Estates', startDate: '23', bgColor: '#6B8E23' },
    { title: 'Total Plots/ Units', startDate: '7,599', bgColor: '#6B8E23' },
    { title: 'Functional Units', startDate: '4,700', bgColor: '#6B8E23' },
    { title: 'Non Functional Units', startDate: '2,100', bgColor: '#6B8E23' },
    { title: 'Vacant', startDate: '600', bgColor: '#6B8E23' },
  ];

  return (
    <Card style={styles.cardContainer}>
      <div style={styles.headerText}>PUNJAB SMALL INDUSTRIES CORPORATION (PSIC)</div>
      <div style={styles.subHeaderText}>Hi, Welcome back to Admin!</div>
      <div style={styles.homeCardContainer}>
        <HomeCard cardsData={cardsData} />
      </div>
    </Card>
  );
}

const styles = {
  cardContainer: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  headerText: {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  subHeaderText: {
    fontSize: '1rem',
    textAlign: 'left',
  },
  homeCardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Space between the cards
    gap: '20px', // Adjust space between items
    width: '100%',
  },
};

export default Home;
