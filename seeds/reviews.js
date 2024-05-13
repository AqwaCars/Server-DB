const { db } = require('../models/index'); // Adjust the path to your models

const reviews = [
    {
      "rating": "5",
      "comment": "Great product! Highly recommend."
    },
    {
      "rating": "4",
      "comment": "Good quality, but shipping was late."
    },
    {
      "rating": "3",
      "comment": "Average product. Nothing special."
    },
    {
      "rating": "2",
      "comment": "Not as described. Disappointed."
    },
    {
      "rating": "1",
      "comment": "Poor quality. Would not buy again."
    },
    {
      "rating": "5",
      "comment": "Excellent service. Very satisfied."
    },
    {
      "rating": "4",
      "comment": "Good overall, but could be better."
    },
    {
      "rating": "3",
      "comment": "Okay product. Met my expectations."
    },
    {
      "rating": "2",
      "comment": "Not worth the price. Unhappy with the purchase."
    },
    {
      "rating": "1",
      "comment": "Terrible experience. Will not order again."
    }
  ]
  ;

async function seedReviews() {
  for (let review of reviews) {
    await db.Review.create(review);
  }
}

seedReviews().then(() => {
  console.log('Seed complete!');
  process.exit(0);
});
