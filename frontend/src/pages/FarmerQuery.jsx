import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { setChatHistory, addMessage, addToolResult, clearState } from '../farmerQuerySlice';

function FarmerQuery() {
  const user = useSelector((state) => state.auth?.user || null);
  const theme = useSelector((state) => state.theme?.theme || 'dark');
  const { chatHistory = [], toolResults = [] } = useSelector((state) => state.farmerQuery || {});
  const dispatch = useDispatch();
  
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedToolData, setParsedToolData] = useState([]);
  const [showResultsPanel, setShowResultsPanel] = useState(false);
  const prevToolResultsLength = useRef(toolResults.length);

  // Parse all tool results when they change
  useEffect(() => {
    if (toolResults?.length > 0) {
      try {
        const allParsedData = toolResults.map(result => {
          // Remove any prefix if present
          const jsonString = result.replace('Tool Result:', '').trim();
          
          // Handle null/empty results
          if (jsonString === 'null' || jsonString === '[]') {
            return {
              noData: true,
              message: "No records found for your query. There might be no data matching your criteria."
            };
          }
          
          try {
            return JSON.parse(jsonString);
          } catch (parseError) {
            return {
              noData: true,
              message: "Unable to parse the response data"
            };
          }
        }).reverse();
        
        setParsedToolData(allParsedData);
      } catch (error) {
        console.error('Error processing tool results:', error);
        setParsedToolData([{
          noData: true,
          message: "Error processing results. Please try again."
        }]);
      }
    } else {
      setParsedToolData([]);
    }
  }, [toolResults]);

  // Automatically open results panel when new tool results arrive
  useEffect(() => {
    if (toolResults.length > prevToolResultsLength.current) {
      setShowResultsPanel(true);
    }
    prevToolResultsLength.current = toolResults.length;
  }, [toolResults]);

  const handleClearChat = () => {
    dispatch(clearState());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedQuery = query?.trim();
    if (!trimmedQuery) return;

    const userMessage = { 
      role: 'user', 
      parts: [{ text: trimmedQuery, type: 'text' }] 
    };
    
    dispatch(addMessage(userMessage));
    setQuery('');
    setIsLoading(true);

    try {
      const response = await axiosClient.post('/chat/handleChat', {
        chatHistory: [...(chatHistory || []), userMessage]
      });

      const data = response.data;

      // Handle different response statuses
      if (data.status === 'ok') {
        // Successful query with records
        const records = data.fullData?.records || [];
        
        // Add a model message indicating success
        dispatch(addMessage({
          role: 'model',
          parts: [{ text: data.message || 'Here are the records you requested.', type: 'text' }]
        }));

        // Add tool result if there are records
        if (records.length > 0) {
          dispatch(addToolResult(JSON.stringify(records)));
        } else {
          // No records found
          dispatch(addToolResult(JSON.stringify({
            noData: true,
            message: 'No records found for the given criteria.'
          })));
        }
      } 
      else if (data.status === 'missing_shop_name' || data.status === 'missing_date_info') {
        // Missing required information
        dispatch(addMessage({
          role: 'model',
          parts: [{ text: data.message || 'Please provide more details.', type: 'text' }]
        }));
      }
      else if (data.status === 'multiple_shops_found') {
        // Multiple shop suggestions
        const suggestions = data.suggestions || [];
        const suggestionText = `Multiple shops found: ${suggestions.join(', ')}. Please specify which one.`;
        dispatch(addMessage({
          role: 'model',
          parts: [{ text: suggestionText, type: 'text' }]
        }));
      }
      else if (data.status === 'shop_not_found') {
        // No shop found
        dispatch(addMessage({
          role: 'model',
          parts: [{ text: data.message || 'Shop not found. Please check the shop name.', type: 'text' }]
        }));
      }
      else {
        // Fallback for any other status
        dispatch(addMessage({
          role: 'model',
          parts: [{ text: data.message || 'Unable to process your request.', type: 'text' }]
        }));
      }
    } catch (error) {
      console.error('Error processing query:', error);
      const errorMessage = {
        role: 'model',
        parts: [{ text: 'Sorry, there was an error processing your request. Please try again later.', type: 'text' }]
      };
      dispatch(addMessage(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for formatting (unchanged)
  const formatFieldName = (field) => {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace('Id', 'ID');
  };

  const isStatusField = (fieldName, value) => {
    const statusFields = ['status', 'state', 'availability', 'sold', 'transactionstatus'];
    const statusValues = ['sold', 'available', 'not available', 'out of stock', 'in stock', 'done', 'completed', 'not done', 'pending'];
    
    return statusFields.includes(fieldName?.toLowerCase()) || 
           (typeof value === 'string' && statusValues.includes(value.toLowerCase()));
  };

  const renderStatusBadge = (value) => {
    if (!value) return value;
    
    const val = value.toString().toLowerCase();
    if (val.includes('sold') || val.includes('done') || val.includes('completed') || val.includes('out of stock') || val.includes('not available')) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          {value}
        </span>
      );
    } else if (val.includes('not sold') || val.includes('not done') || val.includes('pending')) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          {value}
        </span>
      );
    } else if (val.includes('available') || val.includes('in stock')) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          {value}
        </span>
      );
    }
    
    return value;
  };

  const isNumericField = (fieldName, value) => {
    const numericFields = ['price', 'cost', 'amount', 'quantity', 'weight', 'rate', 'total'];
    return numericFields.some(nf => fieldName?.toLowerCase().includes(nf)) && 
           !isNaN(parseFloat(value)) && isFinite(value);
  };

  const formatNumericValue = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    
    if (num >= 1000) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(num);
    }
    
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getFilteredKeys = (data) => {
    if (!data || data.length === 0 || data.noData) return [];
    
    const excludedKeys = ['id', 'dayregisterid', 'farmerid'];
    return Object.keys(data[0]).filter(key => 
      !excludedKeys.some(excluded => key.toLowerCase() === excluded.toLowerCase())
    );
  };

  // Theme-based classes (unchanged – keep your existing definitions)
  const containerBg = theme === 'dark' 
    ? "min-h-screen bg-gradient-to-b from-gray-900 to-gray-800"
    : "min-h-screen bg-gradient-to-b from-gray-100 to-white";
  
  const textColor = theme === 'dark' ? "text-white" : "text-gray-800";
  
  const innerContainerBg = theme === 'dark' 
    ? "h-full bg-gradient-to-br from-gray-800 to-gray-900"
    : "h-full bg-gradient-to-br from-gray-100 to-white";
  
  const chatContainerBg = theme === 'dark' 
    ? "w-full max-w-6xl bg-gray-800 rounded-2xl shadow-2xl border border-gray-700"
    : "w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-200";
  
  const headerBg = theme === 'dark' 
    ? "px-6 py-4 flex items-center justify-between border-b border-gray-700 bg-gray-800"
    : "px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-gray-100";
  
  const chatAreaBg = theme === 'dark' 
    ? "flex-1 overflow-y-auto p-6 space-y-6 bg-gray-800"
    : "flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50";
  
  const userMessageBg = theme === 'dark' 
    ? "bg-gray-700 text-white shadow-lg"
    : "bg-gray-300 text-gray-900 shadow-lg";
  
  const botMessageBg = theme === 'dark' 
    ? "text-white"
    : "text-gray-800";
  
  const loadingBg = theme === 'dark' 
    ? "w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center animate-pulse shadow-lg"
    : "w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center animate-pulse shadow-lg";
  
  const loadingText = theme === 'dark' ? "text-gray-400" : "text-gray-600";
  
  const thinkingBg = theme === 'dark' 
    ? "text-white"
    : "text-gray-800";
  
  const thinkingDot = theme === 'dark' ? "bg-gray-400" : "bg-gray-500";
  
  const footerBg = theme === 'dark' 
    ? "px-6 py-4 border-t border-gray-700 bg-gray-800"
    : "px-6 py-4 border-t border-gray-200 bg-gray-100";
  
  const inputBg = theme === 'dark' 
    ? "flex-1 px-5 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-750 text-white placeholder-gray-500"
    : "flex-1 px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-900 placeholder-gray-500";
  
  const submitButtonBg = theme === 'dark' 
    ? "inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-50 shadow-lg transition-all duration-200 transform hover:scale-105"
    : "inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-50 shadow-lg transition-all duration-200 transform hover:scale-105";
  
  const footerText = theme === 'dark' ? "text-gray-500" : "text-gray-600";

  const modalOverlayBg = theme === 'dark' 
    ? "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";
  
  const modalContentBg = theme === 'dark' 
    ? "bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-7xl"
    : "bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-7xl";
  
  const modalHeaderBg = theme === 'dark' 
    ? "bg-gray-750 border-b border-gray-700"
    : "bg-gray-100 border-b border-gray-200";
  
  const tableHeaderBg = theme === 'dark' 
    ? "bg-gray-700 text-white"
    : "bg-gray-200 text-gray-800";
  
  const tableRowBg = theme === 'dark' 
    ? "bg-gray-800 border-gray-700 text-white"
    : "bg-white border-gray-200 text-gray-800";
  
  const closeButtonBg = theme === 'dark' 
    ? "bg-red-600 hover:bg-red-500 text-white"
    : "bg-red-500 hover:bg-red-400 text-white";

  return (
    <div className={`${containerBg} ${textColor} overflow-hidden py-4`}>
      <div className={`${innerContainerBg} flex items-center justify-center p-4 h-full`}>
        <div className="flex w-full max-w-6xl h-full">
          {/* Main Chat Container */}
          <div className={`${chatContainerBg} overflow-hidden flex flex-col w-full`} style={{ height: '85vh' }}>
            
            <div className={headerBg}>
              {/* Logo Section */}
              <div className="flex items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">CropStatus</span>
                    <span className="text-xs opacity-80">Track your crop to mandi</span>
                  </div>
                </div>
              </div>

              {/* Buttons Section */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleClearChat}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-all duration-200 shadow-md flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Clear Chat
                </button>
                {toolResults?.length > 0 && (
                  <button 
                    onClick={() => setShowResultsPanel(true)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium bg-green-600 hover:bg-green-500 text-white transition-all duration-200 shadow-md flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 001.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    View Results ({toolResults.length})
                  </button>
                )}
              </div>
            </div>

            <div className={chatAreaBg}>
              {isLoading && (!chatHistory || chatHistory.length === 0) ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className={loadingBg}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 011 1v6h6a1 1 0 110 2h-7V3a1 1 0 00-1-1z" />
                      </svg>
                    </div>
                    <div className={`text-sm ${loadingText}`}>Loading your agricultural assistant...</div>
                  </div>
                </div>
              ) : (
                <>
                  {chatHistory?.map((chat, index) => (
                    <div key={index} className="mb-4">
                      <div className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-5 py-3 rounded-2xl ${chat.role === 'user'
                          ? userMessageBg
                          : botMessageBg}`}>
                          <p className="whitespace-pre-wrap leading-relaxed">{chat.parts?.[0]?.text || ''}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && chatHistory?.length > 0 && (
                    <div className="flex justify-start">
                      <div className={thinkingBg}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 ${thinkingDot} rounded-full animate-bounce`}></div>
                          <div className={`w-2 h-2 ${thinkingDot} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                          <div className={`w-2 h-2 ${thinkingDot} rounded-full animate-bounce`} style={{ animationDelay: '0.4s' }}></div>
                          <span className={`ml-2 text-xs ${loadingText}`}>AgriQuery is thinking</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className={footerBg}>
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about yield, mandi rates, or sales records..."
                  className={inputBg}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className={submitButtonBg}
                  disabled={isLoading || !query?.trim()}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  )}
                </button>
              </form>

              <div className={`mt-3 text-xs text-center ${footerText}`}>
                AgriQuery provides agricultural insights. Verify critical information before making decisions.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showResultsPanel && (
        <div className={modalOverlayBg}>
          <div className={`${modalContentBg} max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className={`${modalHeaderBg} px-6 py-4 flex justify-between items-center rounded-t-xl`}>
              <div>
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Records for {user?.name || 'User'} ({user?._id || 'N/A'})
                </h3>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Detailed results from your queries ({parsedToolData.length} table{parsedToolData.length !== 1 ? 's' : ''})
                </p>
              </div>
              <button 
                onClick={() => setShowResultsPanel(false)}
                className={`p-2 rounded-lg ${closeButtonBg} transition-all duration-200 hover:scale-105`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {parsedToolData.length > 0 ? (
                <div className="space-y-8">
                  {parsedToolData.map((data, tableIndex) => {
                    // Handle no data case
                    if (data?.noData) {
                      return (
                        <div key={tableIndex} className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-md p-6">
                          <div className="text-center py-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">No Records Found</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{data.message}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                              Try adjusting your query or check if the data exists in the system.
                            </p>
                          </div>
                        </div>
                      );
                    }

                    const dataArray = Array.isArray(data) ? data : [data];
                    
                    return (
                      <div key={tableIndex} className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead>
                            <tr className={tableHeaderBg}>
                              {getFilteredKeys(dataArray).map((key) => (
                                <th key={key} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                  {formatFieldName(key)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {dataArray.map((item, idx) => (
                              <tr key={idx} className={`${idx % 2 === 0 ? (theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50') : (theme === 'dark' ? 'bg-gray-750' : 'bg-white')} transition-colors duration-150 hover:bg-opacity-90`}>
                                {getFilteredKeys(dataArray).map((key, i) => (
                                  <td key={i} className="px-6 py-4 whitespace-nowrap text-sm">
                                    {isStatusField(key, item[key]) ? 
                                      renderStatusBadge(item[key]) : 
                                      isNumericField(key, item[key]) ? 
                                      <span className="font-mono font-medium">{formatNumericValue(item[key])}</span> : 
                                      item[key] === null || item[key] === undefined ? 
                                      <span className="text-gray-400 dark:text-gray-500">N/A</span> : 
                                      item[key].toString()
                                    }
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-750' : 'bg-gray-100'} shadow-inner`}>
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">No structured data available</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">The query results couldn't be displayed in table format.</p>
                  </div>
                  <div className={`mt-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Raw Responses:</h4>
                    {toolResults?.map((result, index) => (
                      <pre key={index} className="text-xs whitespace-pre-wrap break-words text-gray-500 dark:text-gray-400 mt-2">
                        {result}
                      </pre>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowResultsPanel(false)}
                  className={`px-5 py-2.5 rounded-xl font-medium ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} transition-colors duration-200 flex items-center gap-2`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Close
                </button>
                {parsedToolData.length > 0 && parsedToolData.some(data => !data.noData) && (
                  <button 
                    className="px-5 py-2.5 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Export Data
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FarmerQuery;