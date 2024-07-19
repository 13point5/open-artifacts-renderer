export const testComponent = `
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const LinearEquationInteractive = () => {
  const [slope, setSlope] = useState(1);
  const [yIntercept, setYIntercept] = useState(0);

  const generateData = () => {
    const data = [];
    for (let x = -5; x <= 5; x++) {
      const y = slope * x + yIntercept;
      data.push({ x, y });
    }
    return data;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Interactive Linear Equation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Equation: y = {slope}x + {yIntercept}
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slope (m): {slope}
              </label>
              <Slider
                value={[slope]}
                onValueChange={(value) => setSlope(value[0])}
                min={-5}
                max={5}
                step={0.1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Y-Intercept (b): {yIntercept}
              </label>
              <Slider
                value={[yIntercept]}
                onValueChange={(value) => setYIntercept(value[0])}
                min={-5}
                max={5}
                step={0.1}
              />
            </div>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={generateData()}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <Line
                type="monotone"
                dataKey="y"
                stroke="#8884d8"
                strokeWidth={2}
              />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="x" domain={[-5, 5]} type="number" />
              <YAxis domain={[-5, 5]} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinearEquationInteractive;

`;
