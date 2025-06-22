import { User, Star, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AdvisorCard({ advisor }) {
  return (
    <Card className="border-cyan-900/20 hover:border-cyan-700/40 transition-all">
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-900/20 flex items-center justify-center flex-shrink-0">
            {advisor.imageUrl ? (
              <img
                src={advisor.imageUrl}
                alt={advisor.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-cyan-300" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h3 className="font-medium text-white text-lg">{advisor.name}</h3>
              <Badge
                variant="outline"
                className="bg-cyan-900/20 border-cyan-900/30 text-cyan-300 self-start"
              >
                <Star className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-1">
              {advisor.specialty} • {advisor.experience} years experience
            </p>

            <div className="mt-4 line-clamp-2 text-sm text-muted-foreground mb-4">
              {advisor.description}
            </div>

            <Button
              asChild
              className="w-full bg-cyan-500 hover:bg-cyan-600 mt-2"
            >
              <Link href={`/advisors/${advisor.specialty}/${advisor.id}`}>
                <Calendar className="h-4 w-4 mr-2" />
                View Profile & Book
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
