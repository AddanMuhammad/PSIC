import React from 'react';
import PropTypes from 'prop-types';

const HomeCard = ({ cardsData }) => {
  return (
    <div className="ag-format-container">
      <div className="ag-courses_box">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="ag-courses_item"
            style={{
              // Remove fixed height and width; it'll be controlled by CSS
            }}
          >
            <div className="ag-courses-item_link">
              <div
                className="ag-courses-item_bg"
                style={{ backgroundColor: card.bgColor }}
              ></div>
              <div className="ag-courses-item_title">{card.title}</div>
              <div className="ag-courses-item_date-box">
                 <span className="ag-courses-item_date">{card.startDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// PropTypes validation
HomeCard.propTypes = {
  cardsData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      bgColor: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default HomeCard;
