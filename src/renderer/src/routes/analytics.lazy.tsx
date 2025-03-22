import { createLazyFileRoute } from "@tanstack/react-router";
import { currentProjectIdAtom } from "./__root";
import { useAtomValue } from "jotai";
import { useProject } from "@renderer/hooks/project/useProject";

import { useState } from "react";
import {
  BarChart,
  BookOpen,
  Calendar,
  Clock,
  Folder,
  LineChart,
  PenTool,
  Sigma,
  Star,
  Text,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@renderer/components/ui/tabs";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  useChapterWordCounts,
  useCurrentStreak,
  useDailyWordCounts,
  useFolderCount,
  useMonthlyWordCounts,
  useMostProductiveWeekday,
} from "@renderer/hooks/useAnalytics";

export const Route = createLazyFileRoute("/analytics")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const currentProjectId = useAtomValue(currentProjectIdAtom);
  const { data: project, isLoading } = useProject(currentProjectId!);
  const { data: chapterWordCounts, isLoading: chapterLoading } =
    useChapterWordCounts(currentProjectId!);
  const { data: dailyWordCounts, isLoading: dailyLoading } = useDailyWordCounts(
    currentProjectId!,
  );
  const { data: monthlyWordCounts, isLoading: monthlyLoading } =
    useMonthlyWordCounts(currentProjectId!);
  const { data: folderCount, isLoading: folderLoading } = useFolderCount(
    currentProjectId!,
  );

  const { data: currentStreak, isLoading: streakLoading } = useCurrentStreak(
    currentProjectId!,
  );
  const {
    data: mostProductiveWeekday,
    isLoading: mostProductiveWeekdayLoading,
  } = useMostProductiveWeekday(currentProjectId!);

  const [timeframe, setTimeframe] = useState("week");

  if (
    isLoading ||
    chapterLoading ||
    dailyLoading ||
    monthlyLoading ||
    folderLoading ||
    streakLoading ||
    mostProductiveWeekdayLoading
  ) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-sidebar-primary" />
      </div>
    );
  }

  // Summary statistics
  const totalWordCount =
    chapterWordCounts?.reduce((acc, chapter) => acc + chapter.wordCount, 0) ||
    0;

  const totalChapters = chapterWordCounts?.length || 0;
  const avgWordsPerChapter = Math.round(totalWordCount / totalChapters);
  const avgWordsPerDay = Math.round(
    (totalWordCount ?? 0) / (dailyWordCounts?.length ?? 0),
  );
  const estimatedReadingTime = Math.round((totalWordCount ?? 0) / 250); // Assuming 250 words per minute reading speed

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{project?.name}</h1>
          <p className="text-muted-foreground">
            Track your writing progress and productivity metrics
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Word Count
              </CardTitle>
              <Text className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalWordCount?.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">words written</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chapters</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalChapters}</div>
              <p className="text-xs text-muted-foreground">total chapters</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Folders</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{folderCount}</div>
              <p className="text-xs text-muted-foreground">project folders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Daily Average
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgWordsPerDay.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">words per day</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Writing Progress</CardTitle>
              <CardDescription>Your word count over time</CardDescription>
              <Tabs
                defaultValue="week"
                className="w-full"
                onValueChange={setTimeframe}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="week">This Week</TabsTrigger>
                  <TabsTrigger value="month">This Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={
                      timeframe === "week" ? dailyWordCounts : monthlyWordCounts
                    }
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorCount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--sidebar-primary))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--sidebar-primary))"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey={timeframe === "week" ? "date" : "month"}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    {timeframe === "week" ? "Date" : "Month"}
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    {
                                      payload[0].payload[
                                        timeframe === "week" ? "date" : "month"
                                      ]
                                    }
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Words
                                  </span>
                                  <span className="font-bold">
                                    {payload[0].value?.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--sidebar-primary))"
                      fillOpacity={1}
                      fill="url(#colorCount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Chapter Word Counts</CardTitle>
              <CardDescription>Words per chapter</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={chapterWordCounts}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Chapter
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    {payload[0].payload.name}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Words
                                  </span>
                                  <span className="font-bold">
                                    {payload[0].value?.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="wordCount"
                      fill="hsl(var(--sidebar-primary))"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      type="monotone"
                      dataKey="wordCount"
                      stroke="hsl(var(--accent-foreground))"
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Words Per Chapter
              </CardTitle>
              <Sigma className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgWordsPerChapter.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">words per chapter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Streak
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentStreak?.currentStreak} days
              </div>{" "}
              {/* Placeholder for now */}
              <p className="text-xs text-muted-foreground">
                consecutive writing days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reading Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estimatedReadingTime} min
              </div>
              <p className="text-xs text-muted-foreground">
                estimated reading time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Writing Quality
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Good</div>{" "}
              {/* Placeholder for now */}
              <p className="text-xs text-muted-foreground">readability score</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Writing Insights</CardTitle>
            <CardDescription>
              Tips based on your writing patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-primary/10">
                  <PenTool className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">
                    Most Productive Weekday
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    You write most effectively on {mostProductiveWeekday}.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-primary/10">
                  <BarChart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">
                    Consistency Improvement
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <ConsistencyMessage monthlyWordCounts={monthlyWordCounts} />
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-primary/10">
                  <LineChart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Chapter Length</h4>
                  <p className="text-sm text-muted-foreground">
                    <ChapterLengthMessage
                      chapterWordCounts={chapterWordCounts}
                    />
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ConsistencyMessage({
  monthlyWordCounts,
}: {
  monthlyWordCounts: Array<{ month: string; count: number }> | undefined;
}): JSX.Element {
  if (!monthlyWordCounts || monthlyWordCounts.length < 2) {
    return <span>Keep writing to see your progress!</span>;
  }
  const currentMonth = monthlyWordCounts[monthlyWordCounts.length - 1];
  const previousMonth = monthlyWordCounts[monthlyWordCounts.length - 2];
  const percentageChange =
    ((currentMonth.count - previousMonth.count) / previousMonth.count) * 100;
  const direction = percentageChange >= 0 ? "increased" : "decreased";
  const absPercentage = Math.abs(Math.round(percentageChange));
  return (
    <span>
      Your daily word count has {direction} by {absPercentage}% compared to last
      month.{" "}
      {percentageChange >= 0
        ? "Keep up the good work!"
        : "Try to write more consistently!"}
    </span>
  );
}

function ChapterLengthMessage({
  chapterWordCounts,
}: {
  chapterWordCounts: Array<{ name: string; wordCount: number }> | undefined;
}): JSX.Element {
  if (!chapterWordCounts || chapterWordCounts.length === 0) {
    return <span>Start writing chapters to see length statistics.</span>;
  }

  const averageWords = Math.round(
    chapterWordCounts.reduce((acc, chapter) => acc + chapter.wordCount, 0) /
      chapterWordCounts.length,
  );
  const minWords = Math.min(...chapterWordCounts.map((c) => c.wordCount));
  const maxWords = Math.max(...chapterWordCounts.map((c) => c.wordCount));

  return (
    <span>
      Your chapters average {averageWords.toLocaleString()} words, with lengths
      ranging from {minWords.toLocaleString()} to {maxWords.toLocaleString()}{" "}
      words.
    </span>
  );
}
