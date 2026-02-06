import { motion } from 'motion/react'
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  MousePointerClick,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  trend?: number
  icon: React.ReactNode
  description?: string
  trendPrefix?: string
}

function StatCard({
  title,
  value,
  trend,
  icon,
  description,
  trendPrefix = '',
}: StatCardProps) {
  const isPositive = trend && trend > 0
  const isNegative = trend && trend < 0

  return (
    <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-gray-200/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="bg-primary/5 text-primary rounded-xl p-2.5">
            {icon}
          </div>
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                isPositive
                  ? 'text-emerald-600'
                  : isNegative
                    ? 'text-rose-600'
                    : 'text-gray-500'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : isNegative ? (
                <TrendingDown className="h-3.5 w-3.5" />
              ) : null}
              <span>
                {trend > 0 ? '+' : ''}
                {trend}
                {trendPrefix}
              </span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-gray-400">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface StatsOverviewProps {
  stats: {
    submissions: {
      total: number
      thisWeek: number
      trend: number
    }
    views: {
      total: number
      thisWeek: number
      trend: number
    }
    conversion: {
      rate: number
      previousRate: number
    }
  }
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const conversionTrend = stats.conversion.rate - stats.conversion.previousRate

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatCard
          title="Total Submissions"
          value={stats.submissions.total}
          trend={stats.submissions.trend}
          trendPrefix=" this week"
          icon={<FileText className="h-5 w-5" />}
          description="Total responses across all forms"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StatCard
          title="Total Views"
          value={stats.views.total}
          trend={stats.views.trend}
          trendPrefix=" this week"
          icon={<Users className="h-5 w-5" />}
          description="Total unique form openings"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <StatCard
          title="Completion Rate"
          value={`${stats.conversion.rate.toFixed(1)}%`}
          trend={Number(conversionTrend.toFixed(1))}
          trendPrefix="%"
          icon={<MousePointerClick className="h-5 w-5" />}
          description="Views to submissions conversion"
        />
      </motion.div>
    </div>
  )
}
