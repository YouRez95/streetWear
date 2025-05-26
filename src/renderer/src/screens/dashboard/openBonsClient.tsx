import { ScrollText } from 'lucide-react'

const count = 10
const seasonName = 'Spring 2025'

export function OpenBonsClientCard() {
  return (
    <div className="flex items-center gap-4 bg-foreground rounded-xl p-5 shadow-sm border min-h-24">
      <div className="p-3 bg-secondary rounded-full">
        <ScrollText className="w-6 h-6 text-white" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-0">
        <h3 className="text-lg font-semibold">Bons Clients en cours</h3>
        <p className="text-3xl font-bold tracking-tight font-bagel">
          {count} <span className="text-base font-medium">bons</span>
        </p>
        {/* <p className="text-xs text-background/50">Client bons in progress • {seasonName}</p> */}
      </div>
    </div>
  )
}
