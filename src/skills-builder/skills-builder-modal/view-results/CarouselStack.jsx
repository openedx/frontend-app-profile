import React from 'react';
import { CardCarousel } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import RecommendationCard from './RecommendationCard';
import messages from './messages';

const CarouselStack = ({ selectedRecommendations }) => {
  const { formatMessage } = useIntl();
  const { name: jobName, recommendations } = selectedRecommendations;
  const productTypeNames = Object.keys(recommendations);

  const normalizeProductTypeName = (productType) => {
    // If the productType is more than one word (i.e. boot_camp)
    if (productType.includes('_')) {
      // split to remove underscore and return an array of strings (i.e. ['boot', 'camp'])
      const splitStrings = productType.split('_');

      // map through the array and normalize each string (i.e. ['Boot', 'Camp'])
      const normalizeStrings = splitStrings.map(word => word[0].toUpperCase() + word.slice(1).toLowerCase());

      // return the array as a string joined by white spaces (i.e. Boot Camp)
      return normalizeStrings.join(' ');
    }
    // Otherwise, return a normalized string
    const normalizeString = productType[0].toUpperCase() + productType.slice(1).toLowerCase();
    return normalizeString;
  };

  const renderCarouselTitle = (productType) => (
    <h3>
      {formatMessage(messages.productRecommendationsHeaderText, {
        productType: normalizeProductTypeName(productType),
        jobName,
      })}
    </h3>
  );

  const handleCourseCardClick = (courseKey, productType) => {
    sendTrackEvent(
      'edx.skills_builder.recommendation.click',
      {
        app_name: 'skills_builder',
        category: 'skills_builder',
        page: 'skills_builder',
        course_key: courseKey,
        product_type: productType,
        selected_recommendations: selectedRecommendations,
      },
    );
  };

  return (
    productTypeNames.map(productType => (
      <CardCarousel
        key={productType}
        ariaLabel="card carousel"
        title={renderCarouselTitle(productType)}
      >
        {recommendations[productType].map(rec => (
          <RecommendationCard
            key={rec.uuid}
            handleCourseCardClick={handleCourseCardClick}
            rec={rec}
            productType={productType}
          />
        ))}
      </CardCarousel>
    )));
};

export default CarouselStack;
