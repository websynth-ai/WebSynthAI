"use client";

import { getUIs } from "@/actions/ui/get-uis";
import Header from "@/components/header";
import PromptBadge from "@/components/prompt-badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { timeAgo } from "@/lib/time";
import { Eye, Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Page = () => {
  const [mode, setMode] = useState<string>("latest");
  const [timeRange, setTimeRange] = useState<string>("all");
  const [uis, setUis] = useState<UI[]>([]);
  const [start, setStart] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [maxReached, setMaxReached] = useState(false);
  const limit = 9;
  const router = useRouter();

  interface UI {
    id: string;
    userId: string;
    prompt: string;
    img: string;
    createdAt: Date;
    likesCount: number;
    viewCount: number;
    forkedFrom: string | null;
    user: {
      username: string;
      imageUrl: string | null;
    };
  }

  useEffect(() => {
    const fetchUIs = async () => {
      setIsLoading(true);
      const fetchedUIs = await getUIs(mode, start, limit, timeRange);
      if (fetchedUIs.length === 0) {
        setMaxReached(true);
      }
      if (start === 0) {
        setUis(fetchedUIs);
      } else {
        setUis((prevUis) => [...prevUis, ...fetchedUIs]);
      }
      setIsLoading(false);
    };

    fetchUIs();
  }, [mode, start, timeRange]);

  const handleTabChange = (value: string) => {
    setMaxReached(false);
    setUis([]);
    setMode(value);
    setStart(0);
  };

  const handleTimeRangeChange = (value: string) => {
    setMaxReached(false);
    setUis([]);
    setTimeRange(value);
    setStart(0);
  };

  const handleLoadMore = useCallback(() => {
    if (!maxReached) {
      setStart((prevStart) => prevStart + limit);
    }
  }, [maxReached]);

  useEffect(() => {
    if (isLoading) return;
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;
      if (bottom && !isLoading) {
        handleLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleLoadMore, isLoading]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto pt-5">
        <Tabs
          defaultValue={mode}
          className="w-full mb-4"
          onValueChange={handleTabChange}
        >
          <div className="flex justify-between py-2 ">
            <h1 className="text-3xl font-bold">Explore</h1>
            <div className="flex gap-4">
              {mode !== "latest" && (
                <Select
                  onValueChange={handleTimeRangeChange}
                  defaultValue={timeRange}
                >
                  <SelectTrigger className="w-[180px] h-10 rounded-lg shadow-sm p-2 px-1focus-visible:outline-none">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last 1 Hour</SelectItem>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">This Week</SelectItem>
                    <SelectItem value="30d">This Month</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <TabsList className="bg-gray-300 rounded-lg shadow-sm p-2 px-1 h-10">
                <TabsTrigger
                  value="latest"
                  className="px-4 py-2 text-sm font-medium"
                >
                  Latest
                </TabsTrigger>
                <TabsTrigger
                  value="most_viewed"
                  className="px-4 py-2 text-sm font-medium"
                >
                  Most Viewed
                </TabsTrigger>
                <TabsTrigger
                  value="most_liked"
                  className="px-4 py-2 text-sm font-medium"
                >
                  Most Liked
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value={mode}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uis &&
                uis.map((ui) => (
                  <Card
                    key={ui.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div
                      onClick={() => router.push(`ui/${ui.id}`)}
                      className="w-full h-48 relative cursor-pointer"
                    >
                      <Image
                        src={ui.img}
                        alt={ui.prompt}
                        className="object-cover"
                        fill
                      />
                    </div>
                    <CardContent className="p-2 flex items-center">
                      <div className="flex items-start flex-grow min-w-0 relative">
                        <Tooltip>
                          <TooltipTrigger>
                            <Avatar
                              onClick={() =>
                                router.push(
                                  `/generations/${ui?.user?.username}`
                                )
                              }
                              className="border-2 border-primary h-5 w-5"
                            >
                              <AvatarImage src={ui.user.imageUrl ?? ""} />
                              <AvatarFallback>
                                {ui.user.username.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{ui.user.username}</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger className="rounded-full font-semibold ml-2 flex-1 text-ellipsis overflow-hidden whitespace-nowrap">
                            <PromptBadge
                              variant={"secondary"}
                              className="rounded-full font-semibold flex text-ellipsis overflow-hidden whitespace-nowrap"
                              prompt={ui.prompt}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{ui.prompt}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex items-center whitespace-nowrap ml-2 flex-shrink-0">
                        <Badge
                          variant={"secondary"}
                          className="flex items-center rounded-s-full font-semibold px-2"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          <p className="text-xs text-gray-600">
                            {ui.viewCount}
                          </p>
                        </Badge>
                        <Badge
                          variant={"secondary"}
                          className="flex items-center rounded-e-full font-semibold px-2"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          <p className="text-xs text-gray-600">
                            {ui.likesCount}
                          </p>
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 whitespace-nowrap ml-2 flex-shrink-0">
                        {timeAgo(ui.createdAt)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              {isLoading &&
                [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <Card
                    key={i}
                    className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
                  >
                    <div className="relative">
                      <div className="w-full h-48 bg-gray-200" />
                    </div>
                    <CardContent className="p-2 flex items-center">
                      <div className="flex items-center flex-grow min-w-0 relative">
                        <div className="w-5 h-5 bg-gray-200 rounded-full" />
                        <div className="w-20 h-5 bg-gray-200 rounded-full ml-2" />
                      </div>
                      <div className="w-16 h-5 bg-gray-200 rounded-full" />
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
