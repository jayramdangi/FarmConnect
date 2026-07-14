<<<<<<< HEAD
import { extractShopAndDateIntent } from "../services/llmExtraction.service.js";
import { extractDateRange } from "../services/dateExtraction.service.js";
import { resolveShopBySimilarity } from "../services/shopSimilarity.service.js";
import { fetchFarmerRecords } from "../services/farmerRecords.service.js";

export const handleUnifiedChat = async (req, res) => {
  try {
    console.log(1);
    const { chatHistory } = req.body;
    const farmerId = req.result?.id;

    if (!chatHistory || chatHistory.length === 0) {
      return res.status(400).json({ error: "Chat history is required" });
    }

    if (!farmerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log(2);

    let fullData = {};

    // NEW: Take only the last 5 messages (including the current user message)
    const lastFiveMessages = chatHistory.slice(-5);

     if (!userMessage) {
      return res.status(400).json({ error: "User query not found" });
    }
    console.log(3)

    // STEP 1: LLM – pass the last 5 messages for context
    const { shop_name, chrono_query } = await extractShopAndDateIntent(lastFiveMessages);
    console.log(4);
    console.log(shop_name, chrono_query);

    // (rest of your code remains unchanged)
    if (!shop_name) {
      console.log(5.1);
      return res.json({
        status: "missing_shop_name",
        message: "Please mention the shop name.",
      });
    }
    if (chrono_query === "null") {
      return res.json({
        status: "missing_date_info",
        message: "Please mention the date properly",
      });
    }

    let dateData;
    try {
      dateData = extractDateRange(chrono_query);
    } catch (err) {
      return res.json({
        status: err.message,
        message: "Please provide a valid date or date range.",
      });
    }

    fullData.date = dateData;
    console.log(5);
    console.log(fullData);

    const shopResult = await resolveShopBySimilarity(shop_name);

    if (shopResult.status !== "resolved") {
      return res.json({
        status: shopResult.status,
        extracted_shop_name: shop_name,
        suggestions: shopResult.suggestions,
        message: "Please confirm the correct shop.",
      });
    }
    console.log(6);
    console.log(shopResult);

    fullData.shop = shopResult.shop;
    fullData.shop_confidence = shopResult.confidence;

    const records = await fetchFarmerRecords({
      shopId: shopResult.shop.id,
      farmerId,
      sqlFrom: dateData.sqlFrom,
      sqlTo: dateData.sqlTo,
    });

    fullData.records = records;

    return res.json({
      status: "ok",
      fullData,
      message: "Query processed successfully",
    });

  } catch (error) {
    console.error("Unified chat error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
=======
import { extractShopAndDateIntent } from "../services/llmExtraction.service.js";
import { extractDateRange } from "../services/dateExtraction.service.js";
import { resolveShopBySimilarity } from "../services/shopSimilarity.service.js";
import { fetchFarmerRecords } from "../services/farmerRecords.service.js";

export const handleUnifiedChat = async (req, res) => {
  try {
    console.log(1);
    const { chatHistory } = req.body;
    const farmerId = req.result?.id;

    if (!chatHistory || chatHistory.length === 0) {
      return res.status(400).json({ error: "Chat history is required" });
    }

    if (!farmerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log(2);

    let fullData = {};

    // NEW: Take only the last 5 messages (including the current user message)
    const lastFiveMessages = chatHistory.slice(-5);

     if (!userMessage) {
      return res.status(400).json({ error: "User query not found" });
    }
    console.log(3)

    // STEP 1: LLM – pass the last 5 messages for context
    const { shop_name, chrono_query } = await extractShopAndDateIntent(lastFiveMessages);
    console.log(4);
    console.log(shop_name, chrono_query);

    // (rest of your code remains unchanged)
    if (!shop_name) {
      console.log(5.1);
      return res.json({
        status: "missing_shop_name",
        message: "Please mention the shop name.",
      });
    }
    if (chrono_query === "null") {
      return res.json({
        status: "missing_date_info",
        message: "Please mention the date properly",
      });
    }

    let dateData;
    try {
      dateData = extractDateRange(chrono_query);
    } catch (err) {
      return res.json({
        status: err.message,
        message: "Please provide a valid date or date range.",
      });
    }

    fullData.date = dateData;
    console.log(5);
    console.log(fullData);

    const shopResult = await resolveShopBySimilarity(shop_name);

    if (shopResult.status !== "resolved") {
      return res.json({
        status: shopResult.status,
        extracted_shop_name: shop_name,
        suggestions: shopResult.suggestions,
        message: "Please confirm the correct shop.",
      });
    }
    console.log(6);
    console.log(shopResult);

    fullData.shop = shopResult.shop;
    fullData.shop_confidence = shopResult.confidence;

    const records = await fetchFarmerRecords({
      shopId: shopResult.shop.id,
      farmerId,
      sqlFrom: dateData.sqlFrom,
      sqlTo: dateData.sqlTo,
    });

    fullData.records = records;

    return res.json({
      status: "ok",
      fullData,
      message: "Query processed successfully",
    });

  } catch (error) {
    console.error("Unified chat error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
>>>>>>> bca69bbb98fd0e7ac2d550929a65ad8747f0bf1b
};