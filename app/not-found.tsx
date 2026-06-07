import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background min-h-[60vh]">
      <div className="text-center px-4">
        <h1 className="font-display text-8xl text-primary font-bold mb-4">404</h1>
        <h2 className="font-display text-3xl text-foreground mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">The page you are looking for does not exist.</p>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
