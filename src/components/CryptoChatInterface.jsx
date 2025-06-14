// import Button from "../commonComponents/Button";
// import { Input } from "../commonComponents/Input";
// import { Card, CardContent} from "../commonComponents/Card";
// import { ScrollArea } from "../commonComponents/ScrollArea";
// import { FiMic, FiMicOff, FiSend, FiTrendingUp, FiCreditCard } from "react-icons/fi";
// import { FaRobot } from "react-icons/fa";
// import ChatMessage from "./ChatMessage";
// import { useCryptoAPI } from "../hooks/useCryptoApi";
// import { useVoiceRecording } from "../hooks/useVoiceRecording";
// import { useTextToSpeech } from "../hooks/useTextToSpeech";
// import { usePortfolio } from "../hooks/usePortfolio";
// import { showErrorToast } from "../utils/toast";
// import { useState ,useRef,useEffect} from "react";

// const CryptoChatInterface = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: '1',
//       type: 'bot',
//       content: '👋 Hello! I\'m your crypto assistant. I can help you with:\n\n🔍 Get current prices (try "What\'s BTC price?")\n📈 Show trending coins\n📊 Display crypto stats\n💼 Track your portfolio (say "I have 2 ETH")\n\nWhat would you like to know?',
//       timestamp: new Date()
//     }
//   ]);
//   const [inputText, setInputText] = useState('');
//   const scrollAreaRef = useRef(null);
  
//   const { getCryptoPrice, getTrendingCoins, getCryptoStats } = useCryptoAPI();
//   const { isRecording, startRecording, stopRecording } = useVoiceRecording();
//   const { speak } = useTextToSpeech();
//   const { addHolding, getPortfolioValue, holdings } = usePortfolio();

//   const scrollToBottom = () => {
//     if (scrollAreaRef.current) {
//       const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
//       if (scrollElement) {
//         scrollElement.scrollTop = scrollElement.scrollHeight;
//       }
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const addMessage = (content, type, isLoading = false) => {
//     const newMessage = {
//       id: Date.now().toString(),
//       type,
//       content,
//       timestamp: new Date(),
//       isLoading
//     };
//     setMessages(prev => [...prev, newMessage]);
//     return newMessage.id;
//   };

//   const updateMessage = (id, content, isLoading = false) => {
//     setMessages(prev => prev.map(msg => 
//       msg.id === id ? { ...msg, content, isLoading } : msg
//     ));
//   };

//   const processMessage = async (text) => {
//     let botMessageId;
//     try {
//       botMessageId = addMessage('🤔 Thinking...', 'bot', true);
      
//       const lowerText = text.toLowerCase();
      
//       if (lowerText.includes('price') || lowerText.includes('trading')) {
//         const cryptoMatch = text.match(/\b(btc|bitcoin|eth|ethereum|ada|cardano|sol|solana|doge|dogecoin|matic|polygon)\b/i);
//         if (cryptoMatch) {
//           const symbol = cryptoMatch[1];
//           const price = await getCryptoPrice(symbol);
//           const response = `💰 ${symbol.toUpperCase()} is currently trading at $${price.toLocaleString()}`;
//           updateMessage(botMessageId, response);
//           speak(response);
//         } else {
//           updateMessage(botMessageId, '🔍 Please specify which cryptocurrency you\'d like the price for (e.g., BTC, ETH, ADA)');
//         }
//       } else if (lowerText.includes('trending')) {
//         const trending = await getTrendingCoins();
//         const response = `📈 Today's trending coins:\n\n${trending.map((coin, i) => 
//           `${i + 1}. ${coin.name} (${coin.symbol}) - $${coin.current_price?.toLocaleString() || 'N/A'}`
//         ).join('\n')}`;
//         updateMessage(botMessageId, response);
//         speak('Here are today\'s trending cryptocurrencies');
//       } else if (lowerText.includes('stats') || lowerText.includes('information')) {
//         const cryptoMatch = text.match(/\b(btc|bitcoin|eth|ethereum|ada|cardano|sol|solana|doge|dogecoin|matic|polygon)\b/i);
//         if (cryptoMatch) {
//           const symbol = cryptoMatch[1];
//           const stats = await getCryptoStats(symbol);
//           const response = `📊 ${stats.name} (${stats.symbol.toUpperCase()})\n\n💵 Market Cap: $${stats.market_cap?.toLocaleString() || 'N/A'}\n📈 24h Change: ${stats.price_change_percentage_24h?.toFixed(2) || 'N/A'}%\n\n${stats.description || 'No description available'}`;
//           updateMessage(botMessageId, response);
//           speak(`Here are the stats for ${stats.name}`);
//         } else {
//           updateMessage(botMessageId, '🔍 Please specify which cryptocurrency you\'d like stats for');
//         }
//       } else if (lowerText.includes('i have') || lowerText.includes('portfolio')) {
//         const holdingMatch = text.match(/i have (\d+(?:\.\d+)?)\s*(\w+)/i);
//         if (holdingMatch) {
//           const amount = parseFloat(holdingMatch[1]);
//           const symbol = holdingMatch[2];
//           addHolding(symbol.toLowerCase(), amount);
//           const response = `✅ Added ${amount} ${symbol.toUpperCase()} to your portfolio!`;
//           updateMessage(botMessageId, response);
//           speak(response);
//         } else if (lowerText.includes('portfolio value')) {
//           const value = await getPortfolioValue();
//           const response = `💼 Your portfolio is worth approximately $${value.toLocaleString()}`;
//           updateMessage(botMessageId, response);
//           speak(response);
//         } else {
//           const holdingsList = Object.entries(holdings).map(([symbol, amount]) => 
//             `${amount} ${symbol.toUpperCase()}`
//           ).join(', ');
//           const response = holdingsList ? `💼 Your current holdings: ${holdingsList}` : '💼 You haven\'t added any holdings yet. Try saying "I have 2 ETH"';
//           updateMessage(botMessageId, response);
//         }
//       } else {
//         updateMessage(botMessageId, '🤖 I can help you with:\n\n💰 Crypto prices ("What\'s BTC trading at?")\n📈 Trending coins\n📊 Crypto stats and info\n💼 Portfolio tracking ("I have 2 ETH")\n\nJust ask me anything about crypto!');
//       }
//     } catch (error) {
//       console.error('Error processing message:', error);
//       if (botMessageId) {
//         updateMessage(botMessageId, '😞 Sorry, I encountered an error. The API might be rate-limited. Please try again in a moment.');
//       }
//       showErrorToast("Failed to process your request. Please try again")
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!inputText.trim()) return;

//     addMessage(inputText, 'user');
//     const userMessage = inputText;
//     setInputText('');
    
//     await processMessage(userMessage);
//   };

//   const handleVoiceToggle = async () => {
//     if (isRecording) {
//       const transcript = await stopRecording();
//       if (transcript) {
//         addMessage(transcript, 'user');
//         await processMessage(transcript);
//       }
//     } else {
//       startRecording();
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
//       <div className="max-w-4xl mx-auto h-screen flex flex-col">
//         {/* Header */}
//         <div className="mb-6 text-center">
//           <div className="flex items-center justify-center gap-3 mb-2">
//             <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
//               <FaRobot className="h-8 w-8 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               Crypto Chat Assistant
//             </h1>
//           </div>
//           <p className="text-muted-foreground">Your AI-powered cryptocurrency companion</p>
//         </div>

//         {/* Quick Actions */}
//         <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
//           <Button 
//             variant="outline" 
//             size="sm" 
//             className="shrink-0 bg-white/70 hover:bg-white border-blue-200"
//             onClick={() => processMessage("What's BTC price?")}
//           >
//             <FiTrendingUp className="h-4 w-4 mr-2" />
//             BTC Price
//           </Button>
//           <Button 
//             variant="outline" 
//             size="sm" 
//             className="shrink-0 bg-white/70 hover:bg-white border-purple-200"
//             onClick={() => processMessage("Show trending coins")}
//           >
//             📈 Trending
//           </Button>
//           <Button 
//             variant="outline" 
//             size="sm" 
//             className="shrink-0 bg-white/70 hover:bg-white border-pink-200"
//             onClick={() => processMessage("Portfolio value")}
//           >
//             <FiCreditCard className="h-4 w-4 mr-2" />
//             Portfolio
//           </Button>
//         </div>

//         {/* Chat Card */}
//         <Card className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-xl">
//           <CardContent className="flex-1 flex flex-col p-0">
//             <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
//               <div className="space-y-6">
//                 {messages.map((message) => (
//                   <ChatMessage key={message.id} message={message} />
//                 ))}
//               </div>
//             </ScrollArea>
            
//             {/* Input Area */}
//             <div className="p-6 border-t bg-gradient-to-r from-blue-50/50 to-purple-50/50">
//               <div className="flex gap-3">
//                 <Input
//                   value={inputText}
//                   onChange={(e) => setInputText(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Ask about crypto prices, trends, or tell me your holdings..."
//                   className="flex-1 bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
//                   disabled={isRecording}
//                 />
//                 <Button
//                   onClick={handleVoiceToggle}
//                   variant={isRecording ? "destructive" : "outline"}
//                   size="icon"
//                   className={isRecording ? "animate-pulse" : "bg-white/80 hover:bg-white border-gray-200"}
//                 >
//                   {isRecording ? <FiMicOff className="h-4 w-4" /> : <FiMic className="h-4 w-4" />}
//                 </Button>
//                 <Button 
//                   onClick={handleSendMessage} 
//                   size="icon"
//                   className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
//                 >
//                   <FiSend className="h-4 w-4" />
//                 </Button>
//               </div>
//               {isRecording && (
//                 <div className="flex items-center justify-center gap-2 mt-3 text-sm text-red-600">
//                   <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                   Recording... Click mic to stop
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CryptoChatInterface;

import { useState, useRef, useEffect } from "react";
import Button from "../commonComponents/Button";
import { Input } from "../commonComponents/Input";
import { Card, CardContent } from "../commonComponents/Card";
import { ScrollArea } from "../commonComponents/ScrollArea";
import { FiMic, FiMicOff, FiSend, FiTrendingUp, FiCreditCard } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import ChatMessage from "./ChatMessage";
import { useVoiceRecording } from "../hooks/useVoiceRecording";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { usePortfolio } from "../hooks/usePortfolio";
import { showErrorToast } from "../utils/toast";
import PriceChart from "./PriceChart";

const CryptoChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "bot",
      content:
        "👋 Hello! I'm your crypto assistant. I can help you with:\n\n🔍 Get current prices (try \"What's BTC price?\")\n📈 Show trending coins\n📊 Display crypto stats\n💼 Track your portfolio (say \"I have 2 ETH\")\n📉 Render charts (\"Show 7-day chart for BTC\")\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef(null);
  const { isRecording, startRecording, stopRecording, transcript } = useVoiceRecording();
  const { speak, stopSpeaking } = useTextToSpeech();
  const { addHolding, getPortfolioValue, holdings } = usePortfolio();

  const getTrendingCoins = async () => {
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/search/trending");
      const data = await res.json();

      const coinIds = data.coins.map((c) => c.item.id).join(",");
      const priceRes = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}`
      );
      const priceData = await priceRes.json();
      return priceData;
    } catch (error) {
      console.error("Error fetching trending coins:", error);
      return [];
    }
  };

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [messages]);

  const handleSend = async (customText) => {
    const finalInput = customText ?? inputText;
    if (!finalInput.trim()) return;

    stopSpeaking();

    const userMsg = {
      id: Date.now().toString(),
      type: "user",
      content: finalInput,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const text = finalInput.toLowerCase();
      let response = "";

      if (text.includes("trending")) {
        const trends = await getTrendingCoins();
        if (trends.length === 0) {
          response = "⚠️ Sorry, I couldn't fetch trending coins right now.";
        } else {
          response = `📈 Today's trending coins:\n\n${trends
            .map(
              (coin, i) =>
                `${i + 1}. ${coin.name} (${coin.symbol.toUpperCase()}) - $${
                  coin.current_price?.toLocaleString() || "N/A"
                }`
            )
            .join("\n")}`;
        }
      } else {
        response =
          "🤖 I can help you with:\n\n💰 Crypto prices (\"What's BTC trading at?\")\n📈 Trending coins\n📊 Crypto stats and info\n💼 Portfolio tracking (\"I have 2 ETH\")\n\nJust ask me anything about crypto!";
      }

      const botMsg = {
        id: Date.now().toString() + "_bot",
        type: "bot",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      if (typeof response === "string") speak(response);
    } catch (err) {
      showErrorToast("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <FaRobot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Crypto Chat Assistant
            </h1>
          </div>
          <p className="text-muted-foreground">Your AI-powered cryptocurrency companion</p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <Button onClick={() => handleSend("Show trending coins")} icon={<FiTrendingUp />}>Trending</Button>
          <Button onClick={() => handleSend("What's the price of Bitcoin?")} icon={<FiCreditCard />}>Price</Button>
          <Button onClick={() => handleSend("I have 3 ETH and 0.5 BTC")} icon={<FiCreditCard />}>Portfolio</Button>
        </div>

        {/* Chat Card */}
        <Card className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
              <div className="space-y-6">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isLoading && <p className="text-gray-500">Thinking...</p>}
              </div>
            </ScrollArea>
            <div className="p-6 border-t bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <div className="flex gap-3">
                <Input
                  placeholder="Ask me about crypto..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isRecording}
                />
                <Button onClick={() => handleSend()} icon={<FiSend />} />
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  icon={isRecording ? <FiMicOff /> : <FiMic />} />
              </div>
              {isRecording && (
                <div className="flex items-center justify-center gap-2 mt-3 text-sm text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Recording... Click mic to stop
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CryptoChatInterface;
