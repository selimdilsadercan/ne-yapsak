"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { SwipeableCard } from "@/components/SwipeableCard";
import { ArrowLeft, Users, CheckCircle2, Loader2, PlayCircle, Trophy, Star, ThumbsUp, ThumbsDown, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { OnlineUsersPanel } from "@/components/session/OnlineUsersPanel";
import { MovieSearchDialog } from "@/components/session/MovieSearchDialog";

interface ListItem {
  _id: Id<"listItems">;
  listId: Id<"lists">;
  itemId: string;
  itemType: string;
  order: number;
  notes?: string;
  addedBy: string;
  addedAt: number;
  _creationTime: number;
  name: string;
  imageUrl?: string;
}

function SessionPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const sessionId = params.id as Id<"sessions">;

  const session = useQuery(api.sessions.getSession, { sessionId });
  const joinSession = useMutation(api.sessions.joinSession);
  const castVote = useMutation(api.sessions.castVote);
  const updateActivity = useMutation(api.sessions.updateUserActivity);
  const setUserReadyState = useMutation(api.sessions.setUserReadyState);
  const leaveSession = useMutation(api.sessions.leaveSession);
  const convexUser = user?.id ? useQuery(api.users.getUser, { clerkId: user.id }) : undefined;
  const sessionVotes = useQuery(api.sessions.getSessionVotes, { sessionId });
  const addSessionItem = useMutation(api.sessions.addSessionItem);
  const sessionItems = useQuery(api.sessions.getSessionItems, { sessionId });

  const [votedItems, setVotedItems] = useState<Set<string>>(new Set());
  const [voteCounts, setVoteCounts] = useState<{ [key: string]: { up: number; right: number; left: number } }>({});
  const [hasStarted, setHasStarted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [allVotes, setAllVotes] = useState<{ [key: string]: { up: number; right: number; left: number } }>({});
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [showMovieSearch, setShowMovieSearch] = useState(false);

  // Combine list items and session items
  const allItems = [
    ...(session?.list?.items || []),
    ...(sessionItems || []).map((item) => ({
      _id: `session_${item._id}` as unknown as Id<"listItems">, // Add prefix to distinguish session items
      name: item.name,
      imageUrl: item.imageUrl,
      itemType: item.itemType,
      itemId: item.itemId,
      listId: session?.list?._id as Id<"lists">,
      order: 0,
      notes: "",
      addedBy: item.addedBy,
      addedAt: item.addedAt,
      _creationTime: item.addedAt,
      isSessionItem: true // Add flag to identify session items
    }))
  ];

  // Join session effect
  useEffect(() => {
    if (!session || !convexUser) return;

    // Check if user is already a member using Convex user ID
    const isMember = session.members.some((member) => member.userId === convexUser._id);

    if (!isMember) {
      const joinExistingSession = async () => {
        try {
          await joinSession({ sessionId });
        } catch (error) {
          toast.error("Failed to join session");
          router.back();
        }
      };

      joinExistingSession();
    }
  }, [session, convexUser, joinSession, sessionId, router]);

  // Update activity status effect
  useEffect(() => {
    if (!session || !convexUser) return;

    const updateUserActivity = async () => {
      try {
        await updateActivity({ sessionId });
      } catch (error) {
        // Silently fail activity updates
        console.error("Failed to update activity:", error);
      }
    };

    // Update immediately
    updateUserActivity();

    // Then update every 15 seconds
    const interval = setInterval(updateUserActivity, 15000);

    return () => clearInterval(interval);
  }, [session, convexUser, updateActivity, sessionId]);

  // Check if all users are ready
  useEffect(() => {
    if (!session) return;

    const allReady = session.members.every((member) => member.isReady);
    if (allReady && session.members.length > 0) {
      setHasStarted(true);
    }
  }, [session]);

  // Check if all members have finished voting
  useEffect(() => {
    if (!session) return;

    const totalItems = allItems.length;
    const allFinished = session.members.every((member) => member.votesCount >= totalItems);
    if (allFinished && session.members.length > 0) {
      setIsSessionComplete(true);
    }
  }, [session, allItems]);

  // Update allVotes when sessionVotes changes
  useEffect(() => {
    if (sessionVotes) {
      setAllVotes(sessionVotes);
    }
  }, [sessionVotes]);

  if (!session || !convexUser) {
    return (
      <div className="container flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Yükleniyor...</h1>
      </div>
    );
  }

  const handleReadyToggle = async () => {
    try {
      await setUserReadyState({ sessionId, isReady: !isReady });
      setIsReady(!isReady);
      if (!isReady) {
        toast.success("Hazır olduğunuzu belirttiniz!");
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  const handleSwipe = async (itemId: Id<"listItems">, direction: "left" | "right" | "up") => {
    try {
      // Check if it's a session item (has session_ prefix)
      const isSessionItem = itemId.toString().startsWith("session_");

      // If it's a session item, extract the actual session item ID
      const actualItemId = isSessionItem ? (itemId.toString().replace("session_", "") as Id<"sessionItems">) : itemId;

      await castVote({
        sessionId,
        itemId: actualItemId,
        vote: direction
      });

      // Update vote counts - use the original itemId for the voteCounts state
      setVoteCounts((prev) => ({
        ...prev,
        [itemId]: {
          up: direction === "up" ? (prev[itemId]?.up || 0) + 1 : prev[itemId]?.up || 0,
          right: direction === "right" ? (prev[itemId]?.right || 0) + 1 : prev[itemId]?.right || 0,
          left: direction === "left" ? (prev[itemId]?.left || 0) + 1 : prev[itemId]?.left || 0
        }
      }));

      setVotedItems((prev) => new Set([...prev, itemId.toString()]));

      if (direction === "right") {
        toast.success("İyi eğlenceler!");
      }
    } catch (error) {
      toast.error("Oy kullanılamadı");
    }
  };

  const handleLeaveAndNavigate = async () => {
    try {
      router.push("/");
      await leaveSession({ sessionId });
      toast.success("Oturumdan ayrıldınız");
    } catch (error) {
      toast.error("Oturumdan ayrılırken bir hata oluştu");
    }
  };

  const handleAddMovie = async (movie: any) => {
    try {
      await addSessionItem({
        sessionId,
        itemType: "movie",
        itemId: movie.id.toString(),
        name: movie.title,
        imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      });
      toast.success("Film oturuma eklendi!");
      setShowMovieSearch(false);
    } catch (error) {
      toast.error("Film eklenirken bir hata oluştu");
    }
  };

  // Show start screen if not started
  if (!hasStarted) {
    return (
      <>
        <OnlineUsersPanel sessionId={sessionId} />
        <div className="container flex min-h-[80vh] my-12 flex-col items-center justify-center gap-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <PlayCircle className="h-16 w-16 text-primary" />
            <h1 className="text-2xl font-bold">{session.list?.name}</h1>
            <p className="text-muted-foreground">Oturumun başlaması için tüm katılımcıların hazır olması gerekiyor.</p>
          </div>

          <div className="w-full max-w-[800px] space-y-6">
            {/* Participants */}
            <div className="w-full max-w-[400px] mx-auto rounded-lg border bg-card p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Katılımcılar</h2>
                <div className="space-y-3">
                  {session.members.map((member) => (
                    <div key={member._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {member.user?.image ? (
                          <img src={member.user.image} alt={member.user?.name || ""} className="h-8 w-8 rounded-full" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <span className="font-medium">{member.user?.name || "Anonymous"}</span>
                      </div>
                      {member.isReady ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full mt-6" onClick={handleReadyToggle} variant={isReady ? "outline" : "default"}>
                {isReady ? "Bekleniyor..." : "Hazırım!"}
              </Button>
            </div>

            {/* List Preview */}
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Liste Önizleme</h2>
                <Button onClick={() => setShowMovieSearch(true)} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Film Ekle
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {allItems.map((item) => (
                  <div key={item._id} className="flex flex-col items-center gap-2 p-2 rounded-lg border bg-card">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full aspect-[2/3] rounded-md object-cover" />
                    ) : (
                      <div className="w-full aspect-[2/3] rounded-md bg-muted flex items-center justify-center">
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-center line-clamp-2">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <MovieSearchDialog open={showMovieSearch} onOpenChange={setShowMovieSearch} onMovieSelect={handleAddMovie} />
      </>
    );
  }

  // Show completion screen if all members have finished voting
  if (isSessionComplete) {
    // Combine list items and session items
    const allItems = [
      ...(session.list?.items || []),
      ...(sessionItems || []).map((item) => ({
        _id: `session_${item._id}` as unknown as Id<"listItems">,
        name: item.name,
        imageUrl: item.imageUrl,
        itemType: item.itemType,
        itemId: item.itemId,
        listId: session?.list?._id as Id<"lists">,
        order: 0,
        notes: "",
        addedBy: item.addedBy,
        addedAt: item.addedAt,
        _creationTime: item.addedAt,
        isSessionItem: true
      }))
    ];

    const sortedItems = [...allItems].sort((a, b) => {
      const aScore = (allVotes[a._id]?.right || 0) * 2 - (allVotes[a._id]?.left || 0);
      const bScore = (allVotes[b._id]?.right || 0) * 2 - (allVotes[b._id]?.left || 0);
      return bScore - aScore;
    });

    // Get top 3 items
    const topItems = sortedItems.slice(0, 3);

    return (
      <>
        <OnlineUsersPanel sessionId={sessionId} />
        <div className="container flex py-12 min-h-[80vh] flex-col items-center justify-center gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Trophy className="h-16 w-16 text-yellow-500" />
            <h1 className="text-2xl font-bold">Oturum Tamamlandı!</h1>
            <p className="text-muted-foreground">Tüm katılımcılar oylamayı tamamladı.</p>
          </div>

          {/* Top 3 Items */}
          <div className="w-full max-w-[600px]">
            <h2 className="text-lg font-semibold mb-4 text-center">En Çok Beğenilenler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topItems.map((item, index) => {
                const upVotes = allVotes[item._id]?.up || 0;
                const rightVotes = allVotes[item._id]?.right || 0;
                const leftVotes = allVotes[item._id]?.left || 0;
                const score = rightVotes * 2 - leftVotes;

                // Medal colors for top 3
                const medalColors = [
                  "bg-yellow-500", // Gold
                  "bg-gray-300", // Silver
                  "bg-amber-600" // Bronze
                ];

                return (
                  <div key={item._id} className="flex flex-col items-center p-4 rounded-lg border bg-card">
                    <div className={`w-10 h-10 flex items-center justify-center ${medalColors[index]} rounded-full text-white font-bold mb-2`}>{index + 1}</div>
                    <div className="w-24 h-24 mb-3">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full rounded object-cover" />
                      ) : (
                        <div className="w-full h-full rounded bg-muted flex items-center justify-center">
                          <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-center mb-1">{item.name}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1 text-primary">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{rightVotes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ThumbsDown className="h-4 w-4" />
                        <span>{leftVotes}</span>
                      </div>
                    </div>
                    <div className="mt-2 font-bold text-lg">{score} puan</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full max-w-[600px] space-y-6">
            <div className="rounded-lg border bg-card p-6 text-left">
              <h2 className="text-lg font-semibold mb-4">Tüm Öğeler</h2>
              <div className="space-y-4">
                {sortedItems.map((item, index) => {
                  const upVotes = allVotes[item._id]?.up || 0;
                  const rightVotes = allVotes[item._id]?.right || 0;
                  const leftVotes = allVotes[item._id]?.left || 0;
                  const score = rightVotes * 2 - leftVotes;

                  return (
                    <div key={item._id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full font-bold">{index + 1}</div>
                      <div className="flex-shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded object-cover" />
                        ) : (
                          <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                            <Users className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm">
                          <div className="flex items-center gap-1 text-primary">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{rightVotes}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <ThumbsDown className="h-4 w-4" />
                            <span>{leftVotes}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 font-bold text-lg">{score}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 text-left">
              <h2 className="text-lg font-semibold mb-4">Katılımcılar</h2>
              <div className="space-y-2">
                {session.members.map((member) => (
                  <div key={member._id} className="flex items-center gap-3">
                    {member.user?.image ? (
                      <img src={member.user.image} alt={member.user?.name || ""} className="h-8 w-8 rounded-full" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.user?.name || "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.votesCount} / {allItems.length} oy
                      </p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleLeaveAndNavigate}>
              Listeye Dön
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Show personal completion screen if current user has voted on all items
  if (votedItems.size >= allItems.length) {
    const currentMember = session.members.find((member) => member.userId === convexUser._id);
    const otherMembers = session.members.filter((member) => member.userId !== convexUser._id);
    const finishedMembers = session.members.filter((member) => member.votesCount >= allItems.length);
    const waitingForMembers = session.members.filter((member) => member.votesCount < allItems.length);

    return (
      <>
        <OnlineUsersPanel sessionId={sessionId} />
        <div className="container flex min-h-[80vh] flex-col items-center justify-center gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h1 className="text-2xl font-bold">Oylamanız Tamamlandı!</h1>
            <p className="text-muted-foreground">Diğer katılımcıların oylamayı tamamlamasını bekliyoruz...</p>
          </div>

          <div className="w-full max-w-[400px] space-y-6">
            {/* Your Votes Summary */}
            <div className="rounded-lg border bg-card p-6 text-left">
              <h2 className="text-lg font-semibold mb-4">Sizin Oylarınız</h2>
              <div className="space-y-6">
                {/* Added to Your List */}
                {allItems.some((item) => voteCounts[item._id]?.up) && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-primary border-b pb-2">Listenize Eklenenler</h3>
                    <div className="space-y-2">
                      {allItems
                        .filter((item) => voteCounts[item._id]?.up)
                        .map((item) => (
                          <div key={item._id} className="flex items-center gap-3">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="h-10 w-10 rounded object-cover" />
                            ) : (
                              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                <Users className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <span className="font-medium flex-1">{item.name}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Watch Later */}
                {allItems.some((item) => voteCounts[item._id]?.right) && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-green-500 border-b pb-2">İzlenecekler</h3>
                    <div className="space-y-2">
                      {allItems
                        .filter((item) => voteCounts[item._id]?.right)
                        .map((item) => (
                          <div key={item._id} className="flex items-center gap-3">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="h-10 w-10 rounded object-cover" />
                            ) : (
                              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                <Users className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <span className="font-medium flex-1">{item.name}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Passed */}
                {allItems.some((item) => voteCounts[item._id]?.left) && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">Geçilenler</h3>
                    <div className="space-y-2">
                      {allItems
                        .filter((item) => voteCounts[item._id]?.left)
                        .map((item) => (
                          <div key={item._id} className="flex items-center gap-3">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="h-10 w-10 rounded object-cover" />
                            ) : (
                              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                <Users className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <span className="font-medium flex-1">{item.name}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Participants Status */}
            <div className="rounded-lg border bg-card p-6 text-left">
              <h2 className="text-lg font-semibold mb-4">Katılımcı Durumu</h2>
              <div className="space-y-4">
                {finishedMembers.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-green-500">Tamamlayanlar</h3>
                    <div className="space-y-2">
                      {finishedMembers.map((member) => (
                        <div key={member._id} className="flex items-center gap-3">
                          {member.user?.image ? (
                            <img src={member.user.image} alt={member.user?.name || ""} className="h-8 w-8 rounded-full" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                              <Users className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{member.user?.name || "Anonymous"}</p>
                            <p className="text-xs text-muted-foreground">
                              {member.votesCount} / {allItems.length} oy
                            </p>
                          </div>
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {waitingForMembers.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Devam Edenler</h3>
                    <div className="space-y-2">
                      {waitingForMembers.map((member) => (
                        <div key={member._id} className="flex items-center gap-3">
                          {member.user?.image ? (
                            <img src={member.user.image} alt={member.user?.name || ""} className="h-8 w-8 rounded-full" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                              <Users className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{member.user?.name || "Anonymous"}</p>
                            <p className="text-xs text-muted-foreground">
                              {member.votesCount} / {allItems.length} oy
                            </p>
                          </div>
                          <div className="relative h-5 w-5">
                            <div className="absolute inset-0 border-2 border-muted-foreground rounded-full border-t-transparent animate-spin" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleLeaveAndNavigate}>
              Listeye Dön
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <OnlineUsersPanel sessionId={sessionId} />
      <div className="container py-6">
        <div className="mb-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleLeaveAndNavigate} className="text-muted-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">{session.list?.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{session.members.length} Katılımcı</span>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[320px]">
            <div className="relative h-[500px]">
              {allItems.map((item, index) => {
                if (votedItems.has(item._id.toString())) return null;

                const isTop = !Array.from(votedItems).some(
                  (id) => allItems.findIndex((i) => i._id.toString() === id) < allItems.findIndex((i) => i._id.toString() === item._id.toString())
                );

                if (!isTop) return null;

                return (
                  <div key={item._id} className="absolute inset-x-0">
                    <SwipeableCard
                      title={item.name}
                      imageUrl={item.imageUrl}
                      iconName="HelpCircle"
                      onSwipe={(direction) => handleSwipe(item._id, direction)}
                      enableUpSwipe={false}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mx-auto max-w-[320px]">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>← Geç</span>
              <span>İzle →</span>
            </div>
          </div>
        </div>
      </div>

      <MovieSearchDialog open={showMovieSearch} onOpenChange={setShowMovieSearch} onMovieSelect={handleAddMovie} />
    </>
  );
}

export default SessionPage;
