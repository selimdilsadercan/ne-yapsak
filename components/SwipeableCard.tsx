import { motion, PanInfo, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Icons from "lucide-react";
import Image from "next/image";

interface SwipeableCardProps {
  title: string;
  iconName: string;
  imageUrl?: string;
  onSwipe: (direction: "left" | "right" | "up") => void;
  enableUpSwipe?: boolean;
}

function SwipeableCard({ title, iconName, imageUrl, onSwipe, enableUpSwipe = true }: SwipeableCardProps) {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // @ts-expect-error - We know these icons exist in lucide-react
  const Icon = Icons[iconName];

  // Calculate rotation based on drag
  const rotate = useTransform(x, [-200, 200], [-20, 20]);

  // Calculate opacity for direction indicators
  const leftIndicatorOpacity = useTransform(x, [-200, -100, 0], [1, 1, 0]);
  const rightIndicatorOpacity = useTransform(x, [0, 100, 200], [0, 1, 1]);
  const upIndicatorOpacity = useTransform(y, [-200, -100, 0], [1, 1, 0]);

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset;
    const velocity = info.velocity;

    const swipe = {
      x: Math.abs(offset.x) * Math.sign(velocity.x),
      y: Math.abs(offset.y) * Math.sign(velocity.y)
    };

    // Determine swipe direction based on velocity and offset
    if (Math.abs(swipe.x) > 100 || Math.abs(swipe.y) > 100) {
      if (enableUpSwipe && Math.abs(swipe.y) > Math.abs(swipe.x) && swipe.y < 0) {
        await controls.start({ x: 0, y: -1000, opacity: 0 });
        onSwipe("up");
      } else if (swipe.x > 0) {
        await controls.start({ x: 1000, opacity: 0 });
        onSwipe("right");
      } else {
        await controls.start({ x: -1000, opacity: 0 });
        onSwipe("left");
      }
    } else {
      // Reset position if not swiped far enough
      controls.start({ x: 0, y: 0, opacity: 1 });
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      animate={controls}
      style={{ x, y, rotate }}
      initial={{ opacity: 1 }}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
      }}
      className="absolute w-full cursor-grab active:cursor-grabbing will-change-transform"
    >
      <Card className="relative overflow-hidden shadow-sm transition-shadow hover:shadow-md">
        {/* Left Indicator (NOPE) */}
        <motion.div className="absolute left-4 top-4 z-10 rotate-[-20deg]" style={{ opacity: leftIndicatorOpacity }}>
          <div className="rounded-md border-4 border-red-500 px-4 py-1">
            <span className="text-2xl font-bold text-red-500">NOPE</span>
          </div>
        </motion.div>

        {/* Right Indicator (LIKE) */}
        <motion.div className="absolute right-4 top-4 z-10 rotate-[20deg]" style={{ opacity: rightIndicatorOpacity }}>
          <div className="rounded-md border-4 border-green-500 px-4 py-1">
            <span className="text-2xl font-bold text-green-500">LIKE</span>
          </div>
        </motion.div>

        {/* Up Indicator (SAVE) - Only show if up swipe is enabled */}
        {enableUpSwipe && (
          <motion.div className="absolute left-1/2 top-4 z-10 -translate-x-1/2" style={{ opacity: upIndicatorOpacity }}>
            <div className="rounded-md border-4 border-primary px-4 py-1">
              <span className="text-2xl font-bold text-primary">SAVE</span>
            </div>
          </motion.div>
        )}

        <div className="relative aspect-[4/5] w-full bg-muted">
          {imageUrl ? (
            <Image src={imageUrl} alt={title} fill className="object-cover" sizes="(max-width: 320px) 100vw, 320px" />
          ) : (
            <div className="flex h-full items-center justify-center">{Icon && <Icon className="h-32 w-32 text-muted-foreground/50" />}</div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-muted-foreground">
            <span>← Geç</span>
            {enableUpSwipe && <span>↑ Ekle</span>}
            <span>İzle →</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { SwipeableCard };
