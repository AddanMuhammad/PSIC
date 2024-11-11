import React from 'react';
import Card from './components/Card';
import HomeCard from './components/HomeCard';

function Home() {
  const cardsData = [
    { title: 'Total Region', startDate: '08', bgColor: '#6B8E23' },
    { title: 'Total Area', startDate: '1,920 Acres', bgColor: '#6B8E23' },
    { title: 'Total Functional Units', startDate: '4,700', bgColor: '#6B8E23' },
    { title: 'Total Non Functional Units', startDate: '2,100', bgColor: '#6B8E23' },
    { title: 'Total Vacant', startDate: '600', bgColor: '#6B8E23' },
    { title: 'Total Estate', startDate: '23', bgColor: '#6B8E23' },
    { title: 'Total Plots', startDate: '7,599', bgColor: '#6B8E23' },
  ];

  return (
    <Card style={styles.cardContainer}>
      <div style={styles.headerText}>Dashboard Under-Development</div>
      <div style={styles.subHeaderText}>Hi, Farmer. Welcome back to Admin!</div>
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
