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

const symbolToId = {
  BTC: "bitcoin",
  ETH: "ethereum",
  ADA: "cardano",
  BNB: "binancecoin",
  XRP: "ripple",
  DOGE: "dogecoin",
  MATIC: "matic-network",
};

const getCoinId = (symbol) => {
  return symbolToId[symbol.toUpperCase()] || symbol.toLowerCase();
};

const parsePortfolio = (text) => {
  const regex = /(\d+(?:\.\d+)?)\s*([a-zA-Z]{2,5})/g;
  const results = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    results.push({ symbol: match[2].toUpperCase(), amount: parseFloat(match[1]) });
  }
  return results;
};

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
  const [showChart, setShowChart] = useState(false);
  const [chartCoin, setChartCoin] = useState(null);
  const scrollAreaRef = useRef(null);
  const { isRecording, startRecording, stopRecording, transcript } = useVoiceRecording();
  const { speak, stopSpeaking } = useTextToSpeech();
  const { addHolding, getPortfolioValue } = usePortfolio();

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
    setShowChart(false);

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
      } else if (text.includes("chart")) {
        const match = text.match(/chart.*for (\w+)/);
        if (match) {
          const symbol = match[1];
          const coinId = getCoinId(symbol);
          setChartCoin(coinId);
          setShowChart(true);
          response = `📉 Showing 7-day chart for ${symbol.toUpperCase()}`;
        } else {
          response = "❗ Please specify a coin to show the chart.";
        }
      } else if (text.includes("i have")) {
        const entries = parsePortfolio(finalInput);
        if (!entries.length) {
          response = "❗ Couldn't understand your holdings. Try: I have 2 BTC and 3 ETH";
        } else {
          for (const { symbol, amount } of entries) {
            await addHolding(symbol, amount);
          }
          const value = await getPortfolioValue();
          response = value
            ? `💼 Portfolio saved. Estimated value: $${value.toFixed(2)}`
            : "⚠️ Could not calculate portfolio.";
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

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <Button onClick={() => handleSend("Show trending coins")} icon={<FiTrendingUp />}>
            Trending
          </Button>
          <Button onClick={() => handleSend("What's the price of Bitcoin?")} icon={<FiCreditCard />}>
            Price
          </Button>
          <Button onClick={() => handleSend("I have 3 ETH and 0.5 BTC")} icon={<FiCreditCard />}>
            Portfolio
          </Button>
        </div>

        <Card className="flex flex-col h-[calc(100vh-220px)] bg-white/80 backdrop-blur-sm border-0 shadow-xl overflow-y-scroll">
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
              <div className="space-y-6">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isLoading && <p className="text-gray-500">Thinking...</p>}
                {showChart && chartCoin && <PriceChart coinId={chartCoin} />}
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
                  onClick={() => {
                    stopSpeaking();
                    isRecording ? stopRecording() : startRecording();
                  }}
                  aria-label={isRecording ? "Stop Recording" : "Start Recording"}
                  icon={isRecording ? <FiMicOff /> : <FiMic />}
                />
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
