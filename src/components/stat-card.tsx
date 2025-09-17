import type React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "neutral"
  icon: React.ReactNode
  iconBg: string
}

export function StatCard({ title, value, change, changeType, icon, iconBg }: StatCardProps) {
  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p
              className={cn(
                "text-sm flex items-center gap-1",
                changeType === "positive" ? "text-green-600" : "text-gray-500",
              )}
            >
              {changeType === "positive" && "↑"} {change}
            </p>
          )}
        </div>
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", iconBg)}>{icon}</div>
      </div>
    </Card>
  )
}
