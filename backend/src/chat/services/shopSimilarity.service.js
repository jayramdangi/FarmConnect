import { Sequelize } from "sequelize";
import { Shop } from "../../Models/associations.js";

/**
 * Resolves the best matching shop using pg_trgm similarity.
 * @param {string} shopName - The shop name from the user's query.
 * @returns {Promise<Object>} - Result object with status and shop/suggestions.
 */
export const resolveShopBySimilarity = async (shopName) => {
  try {
    // Ensure the pg_trgm extension is enabled in your database.
    // Run this once: CREATE EXTENSION IF NOT EXISTS pg_trgm;

    const shops = await Shop.findAll({
      attributes: {
        include: [
          [
            Sequelize.fn('similarity', Sequelize.col('name'), shopName),
            'similarity_score'
          ]
        ]
      },
      where: Sequelize.where(
        Sequelize.fn('similarity', Sequelize.col('name'), shopName),
        '>',
        0.2
      ),
      order: [
        [Sequelize.fn('similarity', Sequelize.col('name'), shopName), 'DESC']
      ],
      limit: 5
    });

    if (!shops || shops.length === 0) {
      return { status: "no_match" };
    }

    const topMatch = shops[0];
    const topScore = parseFloat(topMatch.get('similarity_score')) || 0;

    if (topScore < 0.4) {
      return {
        status: "clarification_needed",
        suggestions: shops.map((shop) => ({
          shop_id: shop.id,
          shop_name: shop.name,
          similarity: shop.get('similarity_score')
        }))
      };
    }

    return {
      status: "resolved",
      shop: topMatch,
      confidence: topScore
    };
  } catch (error) {
    console.error('Error in resolveShopBySimilarity:', error);

    // Check if the error is because pg_trgm extension is missing
    if (error.message && error.message.includes('function similarity') && error.message.includes('does not exist')) {
      throw new Error('pg_trgm extension is not enabled. Please run: CREATE EXTENSION pg_trgm;');
    }
    throw error;
  }
};