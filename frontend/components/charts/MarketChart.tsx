"use client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { marketData } from "@/data";

export function MarketChart() {
  return <div className="h-80 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={marketData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip/><Line type="monotone" dataKey="demand" stroke="currentColor" strokeWidth={3}/></LineChart></ResponsiveContainer></div>;
}
export function SalaryChart() {
  return <div className="h-80 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={marketData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip/><Bar dataKey="salary" fill="currentColor"/></BarChart></ResponsiveContainer></div>;
}
