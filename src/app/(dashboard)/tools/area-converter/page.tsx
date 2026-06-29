"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpDown,
  Ruler,
} from "lucide-react";

import {
  AREA_UNITS,
  AreaUnit,
  convertArea,
} from "@/lib/area-converter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AreaConverterPage() {
  const [value, setValue] = useState("100");
  const [from, setFrom] =
    useState<AreaUnit>("sqyd");
  const [to, setTo] =
    useState<AreaUnit>("sqft");

  const result = useMemo(() => {
    const num = Number(value);

    if (isNaN(num) || value === "") {
      return "";
    }

    return convertArea(
      num,
      from,
      to
    ).toLocaleString(undefined, {
      maximumFractionDigits: 4,
    });
  }, [value, from, to]);

  function swapUnits() {
    setFrom(to);
    setTo(from);
  }

  function getReference() {
    if (
      (from === "sqyd" && to === "sqft") ||
      (from === "sqft" && to === "sqyd")
    ) {
      return "1 Sq. Yard = 9 Sq. Ft.";
    }

    if (
      (from === "acre" && to === "bigha") ||
      (from === "bigha" && to === "acre")
    ) {
      return "1 Acre ≈ 1.6 Bigha";
    }

    if (
      (from === "guntha" && to === "sqyd") ||
      (from === "sqyd" && to === "guntha")
    ) {
      return "1 Guntha = 121 Sq. Yard";
    }

    if (
      (from === "acre" && to === "sqyd") ||
      (from === "sqyd" && to === "acre")
    ) {
      return "1 Acre = 4840 Sq. Yard";
    }

    return null;
  }

  return (
    <div className="space-y-6 pb-24">

      <Link
        href="/tools"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tools
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Area Converter
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Convert land area units
          </p>
        </CardHeader>

        <CardContent className="space-y-5">

          {/* Area */}

          <div>
            <p className="mb-2 text-sm font-medium">
              Area
            </p>

            <Input
              type="number"
              value={value}
              onChange={(e) =>
                setValue(e.target.value)
              }
              placeholder="Enter area"
            />
          </div>

          {/* Convert From */}

          <div>
            <p className="mb-2 text-sm font-medium">
              Convert From
            </p>

            <select
              value={from}
              onChange={(e) =>
                setFrom(
                  e.target.value as AreaUnit
                )
              }
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2"
            >
              {Object.entries(
                AREA_UNITS
              ).map(([key, unit]) => (
                <option
                  key={key}
                  value={key}
                >
                  {unit.label}
                </option>
              ))}
            </select>
          </div>

          {/* Swap */}

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={swapUnits}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Convert To */}

          <div>
            <p className="mb-2 text-sm font-medium">
              Convert To
            </p>

            <select
              value={to}
              onChange={(e) =>
                setTo(
                  e.target.value as AreaUnit
                )
              }
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2"
            >
              {Object.entries(
                AREA_UNITS
              ).map(([key, unit]) => (
                <option
                  key={key}
                  value={key}
                >
                  {unit.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Values */}

          <div>
            <p className="mb-2 text-sm font-medium">
              Quick Values
            </p>

            <div className="flex flex-wrap gap-2">

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setValue("100");
                  setFrom("sqyd");
                }}
              >
                100 Sq. Yard
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setValue("500");
                  setFrom("sqyd");
                }}
              >
                500 Sq. Yard
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setValue("1000");
                  setFrom("sqyd");
                }}
              >
                1000 Sq. Yard
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setValue("1");
                  setFrom("guntha");
                }}
              >
                1 Guntha
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setValue("1");
                  setFrom("bigha");
                }}
              >
                1 Bigha
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setValue("1");
                  setFrom("acre");
                }}
              >
                1 Acre
              </Button>

            </div>
          </div>

          {/* Result */}

          <div className="rounded-xl border bg-muted p-5">

            <p className="text-sm text-muted-foreground">
              Conversion Result
            </p>

            <p className="mt-4 text-2xl font-bold">
              {value || "0"}{" "}
              {AREA_UNITS[from].label}
              {" = "}
              {result || "0"}{" "}
              {AREA_UNITS[to].label}
            </p>

            {getReference() && (
              <div className="mt-4 rounded-md border bg-background p-3">
                <p className="text-sm">
                  💡 {getReference()}
                </p>
              </div>
            )}

          </div>

        </CardContent>
      </Card>
    </div>
  );
}