import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ToolsPage() {
  return (
    <div className="space-y-6 pb-24">

      <div>
        <h1 className="text-2xl font-bold">
          Tools
        </h1>

        <p className="text-sm text-muted-foreground">
          Useful tools for brokers
        </p>
      </div>

      <Link href="/tools/area-converter">
        <Card className="cursor-pointer transition hover:shadow-md">
          <CardHeader>
            <CardTitle>
              📐 Area Converter
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Convert Sq. Yard, Sq. Ft.,
              Acre, Bigha, Guntha and Var
            </p>
          </CardContent>
        </Card>
      </Link>

    </div>
  );
}